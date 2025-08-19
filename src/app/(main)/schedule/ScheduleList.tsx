"use client";

import { Box, styled } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AddScheduleForm, {
  TAddScheduleValue,
} from "@/app/(main)/schedule/components/AddScheduleForm";
import DeleteScheduleAlert from "@/app/(main)/schedule/components/DeleteScheduleAlert";
import ScheduleTable from "@/app/(main)/schedule/components/ScheduleTable";
import MasterSchoolFilter from "@/app/(main)/student/components/MasterSchoolFilter";
import Modal from "@/app/_components/common/Modal";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { addSchedule } from "@/app/actions/schedule/addScheduleAction";
import { deleteSchedule } from "@/app/actions/schedule/deleteScheduleAction";
import { getScheduleList } from "@/app/actions/schedule/getScheduleListAction";
import { getSchool } from "@/app/actions/school/getSchoolAction";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import PlusIcon from "@/public/images/icons/plus-icon.svg";

export type TScheduleRowData = {
  id: number;
  month: string;
  date: string;
  scheduleName: string;
  from: "holiday" | "schedule";
  scheduleTarget: string;
};

interface IProps {
  me: GetMeResponse;
  schoolList: GetSchoolListResponse["result"];
}

export default function ScheduleList(props: IProps) {
  const { me, schoolList } = props;

  const [selectedSchool, setSelectedSchool] = useState(me.data?.schoolId ?? "");

  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const queryClient = useQueryClient();

  const currentYear = dayjs().year();
  const queryKey = ["schedule", selectedSchool, me, open];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      getScheduleList({
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

  const { data: getSchoolResult } = useQuery({
    queryKey: ["school", selectedSchool, me, open],
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

  // console.log("getSchoolResult", getSchoolResult);

  useEffect(() => {
    if (selectedSchool == "" && me.data?.type === "teacher") {
      setSelectedSchool(me.data.schoolId);
    }
  }, [selectedSchool]);

  const rows: TScheduleRowData[] = useMemo(() => {
    if (!data?.result) return [];

    return Object.entries(data.result).flatMap(([month, schedules]) =>
      schedules.map((item, index) => ({
        id: item.id,
        month: index === 0 ? month : "", // 월은 첫 행에만 표시
        date: item.date,
        scheduleName: item.scheduleName,
        from: item.from,
        scheduleTarget: item.scheduleTarget,
      })),
    );
  }, [data]);

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
      setOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["schedule", selectedSchool, me],
      });
      return;
    }
    toast.success(res.message);
    setOpen(false);
    await queryClient.invalidateQueries({
      queryKey: ["schedule", selectedSchool, me],
    });
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

  return (
    <Wrapper>
      <BtnWrap>
        <Left>
          {me.data?.type === "master" && (
            <MasterSchoolFilter
              schoolList={schoolList}
              selectedSchool={selectedSchool}
              onChange={(value) => setSelectedSchool(value)}
            />
          )}
        </Left>

        <Center>
          <span>{currentYear}</span>
        </Center>

        <Right>
          <AddScheduleBtn onClick={() => setOpen(true)}>
            일정등록
            <Plus />
          </AddScheduleBtn>
        </Right>
      </BtnWrap>

      {rows.length <= 0 && me.data?.type === "master" ? (
        <EmptyText>
          <span>관리자는 학교를 선택 후 일정 확인이 가능합니다.</span>
        </EmptyText>
      ) : (
        <ScheduleTable rows={rows} onClickEdit={handleEdit} />
      )}

      <Modal
        open={open}
        maxWidth={600}
        onClose={() => setOpen(false)}
        children={
          <AddScheduleForm
            getSchoolResult={getSchoolResult?.result}
            onClose={() => {
              setDeleteId("");
              setOpen(false);
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

const Plus = styled(PlusIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "24px",
  height: "24px",
  path: {
    fill: "#747D8A",
  },
}));

const AddScheduleBtn = styled(Box)(() => {
  return {
    gap: "4px",
    fontSize: 18,
    display: "flex",
    fontWeight: 400,
    cursor: "pointer",
    color: "#747D8A",
    padding: "6px 16px",
    alignItems: "center",
    borderRadius: "100px",
    border: "1px solid #e0e0e0",
  };
});

const EmptyText = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    maxWidth: "917px",
    minHeight: "600px",
    alignItems: "center",
    justifyContent: "center",
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    gap: "16px",
    width: "100%",
    display: "flex",
    maxWidth: "917px",
    textAlign: "center",
    alignItems: "center",
  };
});

const Left = styled(Box)(() => ({
  flex: 1,
  display: "flex",
  justifyContent: "flex-start",
}));

const Center = styled(Box)(() => ({
  flex: 1,
  fontSize: 32,
  fontWeight: 700,
  display: "flex",
  color: "#464B53",
  justifyContent: "center",
}));

const Right = styled(Box)(() => ({
  flex: 1,
  display: "flex",
  justifyContent: "flex-end",
}));
