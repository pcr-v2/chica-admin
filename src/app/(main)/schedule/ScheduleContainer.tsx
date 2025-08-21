"use client";

import FullCalendar from "@fullcalendar/react";
import { Box, Button, styled } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import ScheduleCalendar from "@/app/(main)/schedule/ScheduleCalendar";
import ScheduleList from "@/app/(main)/schedule/ScheduleList";
import AddScheduleForm, {
  TAddScheduleValue,
} from "@/app/(main)/schedule/components/AddScheduleForm";
import DeleteScheduleAlert from "@/app/(main)/schedule/components/DeleteScheduleAlert";
import ScheduleHeader from "@/app/(main)/schedule/components/ScheduleHeader";
import UpateScheduleForm from "@/app/(main)/schedule/components/UpateScheduleForm";
import Modal from "@/app/_components/common/Modal";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { addSchedule } from "@/app/actions/schedule/addScheduleAction";
import { deleteSchedule } from "@/app/actions/schedule/deleteScheduleAction";
import {
  getScheduleList,
  MergedSchedule,
} from "@/app/actions/schedule/getScheduleListAction";
import { fetchAndSaveHolidays } from "@/app/actions/school/fetchAndSaveHolidays";
import { getSchool } from "@/app/actions/school/getSchoolAction";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";

export type TScheduleRowData = {
  id: number;
  month: string;
  date: string;
  scheduleName: string;
  from: "holiday" | "schedule";
  scheduleTarget: string;
};

export type TUpdateDate = {
  id: number;
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

  const { data: scheduleListRes } = useQuery<MergedSchedule>({
    queryKey: ["scheduleList", selectedSchool, me, addModal],
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
        queryKey: ["scheduleList", selectedSchool, me, addModal],
      });
      return;
    }
    toast.success(res.message);
    setAddModal(false);
    await queryClient.invalidateQueries({
      queryKey: ["scheduleList", selectedSchool, me, addModal],
    });

    queryClient.refetchQueries({ queryKey: ["schedule", selectedSchool, me] });
  };

  const handleEdit = async (scheduleId: number) => {
    if (scheduleId == null) return;
    setDeleteId(String(scheduleId));
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const res = await deleteSchedule({ scheduleId: Number(deleteId) });

    if (res.code === "FAIL") {
      toast.error(res.message);
      setDeleteModal(false);
      setDeleteId("");
      await queryClient.invalidateQueries({
        queryKey: ["schedule", selectedSchool, me],
      });
      return;
    }
    toast.success(res.message);
    setDeleteId("");
    setDeleteModal(false);
    await queryClient.invalidateQueries({
      queryKey: ["schedule", selectedSchool, me],
    });
  };

  const [drag, setDrag] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  return (
    <Wrapper>
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
          handleDragCalendar={(startDate, endDate) => {
            // console.log(startDate, endDate);
            setDrag({ startDate, endDate });
            setAddModal(true);
          }}
          handleUpdateCalendar={(value) => {
            const { id, startDate, endDate, newStartDate, newEndDate } = value;
            setUpdateModal(true);
            setUpdateDate({ id, startDate, endDate, newStartDate, newEndDate });
          }}
        />
      ) : (
        <ScheduleList me={me} schoolList={schoolList} />
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
            // onDelete={() => {}}
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
        isDelete
        open={updateModal}
        maxWidth={360}
        children={
          <UpateScheduleForm
            value={updateDate as TUpdateDate}
            onClose={() => setUpdateModal(false)}
            onUpdate={() => {}}
          />
        }
        onClose={() => {
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
