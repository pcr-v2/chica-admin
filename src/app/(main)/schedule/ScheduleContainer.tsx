"use client";

import FullCalendar from "@fullcalendar/react";
import { Box, styled } from "@mui/material";
import { useRef, useState } from "react";

import ScheduleCalendar from "@/app/(main)/schedule/ScheduleCalendar";
import ScheduleList from "@/app/(main)/schedule/ScheduleList";
import ScheduleHeader from "@/app/(main)/schedule/components/ScheduleHeader";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { MergedSchedule } from "@/app/actions/schedule/getScheduleListAction";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";

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
  scheduleList: MergedSchedule;
}

export default function ScheduleContainer(props: IProps) {
  const { me, schoolList, scheduleList } = props;

  const [type, setType] = useState<"calendar" | "list">("calendar");

  const calendarRef = useRef<FullCalendar>(null);

  return (
    <Wrapper>
      <ScheduleHeader
        type={type}
        onClickType={(value) => setType(value)}
        ref={calendarRef}
      />

      {type === "calendar" ? (
        <ScheduleCalendar
          me={me}
          scheduleList={scheduleList}
          calendarRef={calendarRef}
        />
      ) : (
        <ScheduleList me={me} schoolList={schoolList} />
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
    padding: "32px 28px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
  };
});
