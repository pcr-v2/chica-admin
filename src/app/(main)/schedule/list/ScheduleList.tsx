"use client";

import { Box, styled } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AddScheduleForm, {
  TAddScheduleValue,
} from "@/app/(main)/schedule/forms/AddScheduleForm";
import DeleteScheduleAlert from "@/app/(main)/schedule/forms/DeleteScheduleAlert";
import ScheduleTable from "@/app/(main)/schedule/list/ScheduleTable";
import Modal from "@/app/_components/common/Modal";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { addSchedule } from "@/app/actions/schedule/addScheduleAction";
import { deleteSchedule } from "@/app/actions/schedule/deleteScheduleAction";
import {
  getScheduleList,
  MergedSchedule,
} from "@/app/actions/schedule/getScheduleListAction";
import { getSchool } from "@/app/actions/school/getSchoolAction";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import PlusIcon from "@/public/images/icons/plus-icon.svg";

export type TScheduleRowData = {
  id: number;
  month: string;
  date: string;
  scheduleSetId: string;
  scheduleName: string;
  from: "holiday" | "schedule";
  scheduleTarget: string;
};

interface IProps {
  me: GetMeResponse;
  schoolList: GetSchoolListResponse["result"];
  scheduleListRes: MergedSchedule;
  handleDelete: (scheduleSetId: string) => void;
}

export default function ScheduleList(props: IProps) {
  const { me, schoolList, scheduleListRes, handleDelete } = props;

  const [selectedSchool, setSelectedSchool] = useState(me.data?.schoolId ?? "");

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

  // console.log("getSchoolResult", getSchoolResult);

  useEffect(() => {
    if (selectedSchool == "" && me.data?.type === "teacher") {
      setSelectedSchool(me.data.schoolId);
    }
  }, [selectedSchool]);

  const rows: TScheduleRowData[] = useMemo(() => {
    if (!scheduleListRes) return [];

    return Object.entries(scheduleListRes).flatMap(([month, schedules]) =>
      schedules.map((item, index) => ({
        id: item.id,
        month: index === 0 ? month : "", // 월은 첫 행에만 표시
        date: item.date,
        scheduleSetId: item.scheduleSetId,
        scheduleName: item.scheduleName,
        from: item.from,
        scheduleTarget: item.scheduleTarget,
      })),
    );
  }, [scheduleListRes]);

  return (
    <Wrapper>
      {rows.length <= 0 && me.data?.type === "master" ? (
        <EmptyText>
          <span>관리자는 학교를 선택 후 일정 확인이 가능합니다.</span>
        </EmptyText>
      ) : (
        <ScheduleTable rows={rows} handleDelete={handleDelete} />
      )}
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
    // padding: "32px 28px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
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
