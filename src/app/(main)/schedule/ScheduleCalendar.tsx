"use client";

import { RefObject } from "@fullcalendar/core/preact.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { Box, styled, Tooltip } from "@mui/material";
// a plugin!

import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import CustomCode from "@/app/(main)/schedule/CustomCssWrap";
import { TUpdateDate } from "@/app/(main)/schedule/ScheduleContainer";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { MergedSchedule } from "@/app/actions/schedule/getScheduleListAction";

interface IProps {
  me: GetMeResponse;
  scheduleList: MergedSchedule;
  calendarRef: RefObject<FullCalendar | null>;

  handleDragCalendar: (startDate: string, endDate: string) => void;
  handleUpdateCalendar: (value: TUpdateDate) => void;
}
export default function ScheduleCalendar(props: IProps) {
  const {
    me,
    scheduleList,
    calendarRef,
    handleDragCalendar,
    handleUpdateCalendar,
  } = props;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 0);
  }, []);

  // "2025.08.15.(금)" → "2025-08-15"
  function formatDateToISO(dateStr: string) {
    const [year, month, day] = dateStr.slice(0, 10).split(".");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // 하루 차이인지 체크
  function isNextDay(dateA: string, dateB: string) {
    const toDate = (d: string) => {
      const [year, month, day] = d.slice(0, 10).split(".");
      return new Date(Number(year), Number(month) - 1, Number(day));
    };
    return (
      toDate(dateB).getTime() - toDate(dateA).getTime() === 24 * 60 * 60 * 1000
    );
  }

  // (선택) 연속 바를 자연스럽게 잇고 싶으면 end를 "마지막날+1일"로 바꿔서 사용
  function addOneDayISO(dateStr: string) {
    const d = new Date(formatDateToISO(dateStr));
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }

  const events = useMemo(() => {
    if (!scheduleList) return [];

    const allSchedules = Object.values(scheduleList).flat();
    if (allSchedules.length === 0) return [];

    // 표시용 타이틀
    const getDisplayName = (
      scheduleName: string,
      from: string,
      target?: string,
    ) => {
      if (from === "schedule") {
        if (target === "all") return `${scheduleName} (전교생)`;
        if (target) return `${scheduleName} (${target}학년)`;
      }
      return scheduleName;
    };

    // 1) (from, scheduleName, scheduleTarget)로 그룹핑
    type Item = (typeof allSchedules)[number];
    const keyOf = (it: Item) =>
      `${it.from}||${it.scheduleName}||${it.scheduleTarget ?? ""}`;

    const groups = new Map<string, Item[]>();
    for (const it of allSchedules) {
      const k = keyOf(it);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(it);
    }

    // 2) 각 그룹 내부에서 날짜 정렬 후, 연속 구간으로 압축
    const result: {
      id: string;
      title: string;
      start: string;
      end?: string;
      from: "holiday" | "schedule";
    }[] = [];

    for (const [, items] of groups) {
      items.sort((a, b) => {
        const da = new Date(formatDateToISO(a.date)).getTime();
        const db = new Date(formatDateToISO(b.date)).getTime();
        return da - db;
      });

      let runStart = items[0].date;
      let runEnd = items[0].date;

      for (let i = 1; i < items.length; i++) {
        const prev = items[i - 1];
        const curr = items[i];
        if (isNextDay(prev.date, curr.date)) {
          // 연속이면 끝만 늘림
          runEnd = curr.date;
        } else {
          // 끊기면 현재까지 하나 push
          const base = items[i - 1];
          const title = getDisplayName(
            base.scheduleName,
            base.from,
            base.scheduleTarget,
          );

          if (runStart !== runEnd) {
            result.push({
              id: String(base.id),
              title,
              start: formatDateToISO(runStart),
              // end: formatDateToISO(runEnd),
              end: addOneDayISO(runEnd), // 연속 바 잇고 싶으면 이걸로
              from: base.from,
            });
          } else {
            result.push({
              id: String(base.id),
              title,
              start: formatDateToISO(runStart),
              from: base.from,
            });
          }
          // 새 런 시작
          runStart = curr.date;
          runEnd = curr.date;
        }
      }

      // 마지막 런 push
      const base0 = items[0];
      const title0 = getDisplayName(
        base0.scheduleName,
        base0.from,
        base0.scheduleTarget,
      );
      if (runStart !== runEnd) {
        result.push({
          id: String(base0.id),
          title: title0,
          start: formatDateToISO(runStart),
          end: addOneDayISO(runEnd), // 옵션
          from: base0.from as "holiday" | "schedule",
        });
      } else {
        result.push({
          id: String(base0.id),
          title: title0,
          start: formatDateToISO(runStart),
          from: base0.from as "holiday" | "schedule",
        });
      }
    }

    // 3) 시작일 기준 정렬
    result.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );

    return result;
  }, [scheduleList]);

  // console.log("events", events);

  if (ready === false)
    return <Box sx={{ minHeight: "870px", backgroundColor: "#fff" }} />;

  return (
    <Wrapper>
      <CustomCode />
      <FullCalendar
        // datesSet={updateTitle}
        height="870px" // ← 이걸로 제일 깔끔하게 고정됨
        contentHeight="753px"
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="kr"
        events={events}
        eventClassNames={(arg) => {
          if (arg.event.extendedProps.from === "holiday")
            return ["holiday-event"];
          return ["schedule-event"];
        }}
        eventDrop={(info) => {
          // info.oldEvent, info.event 등으로 옮긴 이벤트 정보 확인 가능
          const startDate = dayjs(info.oldEvent.start).format("YYYY-MM-DD");
          const endDate = info.oldEvent.end
            ? dayjs(info.oldEvent.end).subtract(1, "day").format("YYYY-MM-DD")
            : startDate;

          const newStartDate = dayjs(info.event.start).format("YYYY-MM-DD");
          const newEndDate = info.event.end
            ? dayjs(info.event.end).subtract(1, "day").format("YYYY-MM-DD")
            : newStartDate;

          handleUpdateCalendar({
            id: Number(info.event.id),
            startDate,
            endDate,
            newStartDate,
            newEndDate,
          });

          // console.log(
          //   `이벤트 이동: ${oldStart} ~ ${oldEnd} → ${newStart} ~ ${newEnd}`,
          // );

          // 서버에 변경된 일정 저장 가능
        }}
        eventContent={(arg) => {
          const from = arg.event.extendedProps.from;
          return (
            <Tooltip
              title={arg.event.title}
              arrow
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: from === "holiday" ? "#FFEBEE" : "#E5F2FF",
                    color: from === "holiday" ? "#EF5350" : "#48A4FF",
                    fontSize: 12,
                    fontWeight: 500,
                  },
                },
                arrow: {
                  sx: {
                    color: from === "holiday" ? "#FFEBEE" : "#E5F2FF",
                  },
                },
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  backgroundColor: from === "holiday" ? "#FFEBEE" : "#E5F2FF",
                  padding: "2px 4px",
                  color: from === "holiday" ? "#EF5350" : "#48A4FF",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: "2px",
                }}
              >
                {arg.timeText && <b>{arg.timeText}</b>} {arg.event.title}
              </div>
            </Tooltip>
          );
        }}
        headerToolbar={false}
        editable
        selectable={true} // ← 드래그 선택 가능
        selectMirror={true} // ← 선택 영역 미리보기
        select={(info) => {
          // alert(
          //   `${dayjs(info.startStr).format("YYYY-MM-DD")}부터 ${dayjs(info.endStr).subtract(1, "days").format("YYYY-MM-DD")}까지 일정을 추가하세요!`,
          // );

          handleDragCalendar(
            dayjs(info.startStr).format("YYYY-MM-DD"),
            dayjs(info.endStr).subtract(1, "days").format("YYYY-MM-DD"),
          );
          // 나중에 모달 호출로 변경 가능
          // openScheduleModal(info.startStr, info.endStr);
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "start",
    minHeight: "100dvh",
  };
});
