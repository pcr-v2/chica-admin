"use client";

import FullCalendar from "@fullcalendar/react";
import { Box, styled } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import ScheduleCalendar from "@/app/(main)/schedule/calendar/ScheduleCalendar";
import MasterSchoolFilter from "@/app/(main)/schedule/filters/MasterSchoolFilter";
import ScheduleHeader from "@/app/(main)/schedule/filters/ScheduleHeader";
import AddScheduleForm, {
  TAddScheduleValue,
} from "@/app/(main)/schedule/forms/AddScheduleForm";
import DeleteScheduleAlert from "@/app/(main)/schedule/forms/DeleteScheduleAlert";
import UpateScheduleForm from "@/app/(main)/schedule/forms/UpateScheduleForm";
import ScheduleList from "@/app/(main)/schedule/list/ScheduleList";
import Modal from "@/app/_components/common/Modal";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { addSchedule } from "@/app/actions/schedule/addScheduleAction";
import { deleteSchedule } from "@/app/actions/schedule/deleteScheduleAction";
import {
  getScheduleList,
  MergedSchedule,
} from "@/app/actions/schedule/getScheduleListAction";
import { updateSchedule } from "@/app/actions/schedule/updateScheduleAction";
import { getSchool } from "@/app/actions/school/getSchoolAction";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";

export type TScheduleRowData = {
  id: number;
  month: string;
  date: string;
  scheduleSetId: string;
  scheduleName: string;
  from: "holiday" | "schedule";
  scheduleTarget: string;
};

export type TUpdateDate = {
  scheduleSetId: string;
  startDate: string;
  endDate: string;
  newStartDate: string;
  newEndDate: string;
};

interface IProps {
  me: GetMeResponse;
  schoolList: GetSchoolListResponse["result"];
  scheduleList: MergedSchedule;
}

export default function ScheduleContainer(props: IProps) {
  const { me, schoolList, scheduleList } = props;

  const [type, setType] = useState<"calendar" | "list">("calendar");
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateDate, setUpdateDate] = useState<TUpdateDate | null>(null);

  const [deleteId, setDeleteId] = useState("");

  const calendarRef = useRef<FullCalendar>(null);

  const [selectedSchool, setSelectedSchool] = useState(me.data?.schoolId ?? "");

  const [drag, setDrag] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  const [pendingRevert, setPendingRevert] = useState<(() => void) | null>(null);

  const { data: scheduleListRes } = useQuery<MergedSchedule>({
    queryKey: [
      "scheduleList",
      selectedSchool,
      me,
      addModal,
      type,
      deleteModal,
      updateModal,
    ],
    queryFn: async () => {
      const res = await getScheduleList({ schoolId: selectedSchool });
      if (res.code !== "SUCCESS") {
        throw new Error(res.message);
      }
      return res.result;
    },
    initialData: scheduleList,
    enabled: !!me,
  });
  // console.log("scheduleListRes", scheduleListRes);

  const { data: getSchoolResult } = useQuery({
    queryKey: ["school", selectedSchool, me],
    queryFn: () =>
      getSchool({
        schoolId: selectedSchool,
      }).then((res) => {
        if (res.code === "FAIL") {
          toast.error(res.message);
          return null;
        }

        return res;
      }),
    staleTime: 0,
    enabled: !!selectedSchool,
  });

  const queryClient = useQueryClient();

  const handleRegist = async (value: TAddScheduleValue) => {
    const res = await addSchedule({
      schoolId: selectedSchool,
      scheduleStatus: true,
      scheduleTarget: value.target,
      schoolLevel: me.data?.schoolLevel as "elementary" | "middle" | "high",
      ...value,
    });

    if (res.code === "FAIL") {
      toast.error(res.message);
      setAddModal(false);
      await queryClient.invalidateQueries({
        queryKey: [
          "scheduleList",
          selectedSchool,
          me,
          addModal,
          type,
          deleteModal,
          updateModal,
        ],
      });
      return;
    }
    toast.success(res.message);
    setAddModal(false);
    await queryClient.invalidateQueries({
      queryKey: [
        "scheduleList",
        selectedSchool,
        me,
        addModal,
        type,
        deleteModal,
        updateModal,
      ],
    });

    queryClient.refetchQueries({
      queryKey: [
        "scheduleList",
        selectedSchool,
        me,
        addModal,
        type,
        deleteModal,
        updateModal,
      ],
    });
  };

  const handleDelete = async () => {
    const res = await deleteSchedule({ scheduleSetId: deleteId });

    if (res.code === "FAIL") {
      toast.error(res.message);
      setDeleteModal(false);
      setDeleteId("");
      await queryClient.invalidateQueries({
        queryKey: [
          "scheduleList",
          selectedSchool,
          me,
          addModal,
          type,
          deleteModal,
          updateModal,
        ],
      });
      return;
    }
    toast.success(res.message);
    setDeleteId("");
    setDeleteModal(false);
    await queryClient.invalidateQueries({
      queryKey: [
        "scheduleList",
        selectedSchool,
        me,
        addModal,
        type,
        deleteModal,
        updateModal,
      ],
    });
  };

  const handleUpdate = async () => {
    if (updateDate == null) return;
    const start = dayjs(updateDate.startDate);
    const newStart = dayjs(updateDate.newStartDate);

    // 차이값 (단위: 일)
    const diffInDays = newStart.diff(start, "day");

    const res = await updateSchedule({
      scheduleSetId: updateDate.scheduleSetId,
      dateDiff: diffInDays,
    });

    if (res.code !== "SUCCESS") {
      toast.error(res.message);
      setUpdateModal(false);
      return;
    }

    toast.success(res.message);
    setUpdateModal(false);
    await queryClient.invalidateQueries({
      queryKey: [
        "scheduleList",
        selectedSchool,
        me,
        addModal,
        type,
        deleteModal,
        updateModal,
      ],
    });
  };

  return (
    <Wrapper>
      <FilterBox>
        {me.data?.type === "master" && (
          <MasterSchoolFilter
            onChange={(value) => setSelectedSchool(value)}
            schoolList={schoolList}
            selectedSchool={selectedSchool}
          />
        )}
      </FilterBox>

      <ScheduleHeader
        type={type}
        ref={calendarRef}
        onClickType={(value) => setType(value)}
        onClickAdd={() => setAddModal(true)}
      />

      {type === "calendar" ? (
        <ScheduleCalendar
          me={me}
          // key={scheduleListRes?.length}
          scheduleList={scheduleListRes}
          calendarRef={calendarRef}
          handleRevert={(value) => setPendingRevert(value)}
          handleDragCalendar={(startDate, endDate) => {
            // console.log(startDate, endDate);
            setDrag({ startDate, endDate });
            setAddModal(true);
          }}
          handleUpdateCalendar={(value) => {
            const {
              scheduleSetId,
              startDate,
              endDate,
              newStartDate,
              newEndDate,
            } = value;
            setUpdateModal(true);
            setUpdateDate({
              scheduleSetId,
              startDate,
              endDate,
              newStartDate,
              newEndDate,
            });
          }}
          handleDelete={(scheduleSetId: string) => {
            setDeleteId(scheduleSetId);
            setDeleteModal(true);
          }}
        />
      ) : (
        <ScheduleList
          me={me}
          schoolList={schoolList}
          handleDelete={(scheduleSetId: string) => {
            setDeleteId(scheduleSetId);
            setDeleteModal(true);
          }}
          scheduleListRes={scheduleListRes}
        />
      )}

      <Modal
        open={addModal}
        maxWidth={600}
        onClose={() => {
          setAddModal(false);
          setDrag(null);
        }}
        children={
          <AddScheduleForm
            dragDate={drag}
            getSchoolResult={getSchoolResult?.result}
            onClose={() => {
              setDrag(null);
              setDeleteId("");
              setAddModal(false);
            }}
            onConfirm={handleRegist}
          />
        }
      />

      <Modal
        isDelete
        open={deleteModal}
        maxWidth={360}
        children={
          <DeleteScheduleAlert
            onDelete={handleDelete}
            onClose={() => {
              setDeleteId("");
              setDeleteModal(false);
            }}
          />
        }
        onClose={() => {
          setDeleteId("");
          setDeleteModal(false);
        }}
      />

      <Modal
        open={updateModal}
        maxWidth={360}
        isDelete
        children={
          <UpateScheduleForm
            value={updateDate as TUpdateDate}
            onClose={() => {
              if (pendingRevert) {
                pendingRevert(); // ✅ 여기서 원상 복구
                setPendingRevert(null);
              }
              setUpdateModal(false);
            }}
            onUpdate={handleUpdate}
          />
        }
        onClose={() => {
          if (pendingRevert) {
            pendingRevert(); // ✅ 여기서 원상 복구
            setPendingRevert(null);
          }
          setUpdateDate(null);
          setUpdateModal(false);
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderRadius: "24px",
    padding: "32px 28px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
  };
});

const FilterBox = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    maxWidth: "917px",
    justifyContent: "start",
  };
});
