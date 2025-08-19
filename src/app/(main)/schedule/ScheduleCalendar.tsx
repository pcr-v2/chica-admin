"use client";

import { RefObject } from "@fullcalendar/core/preact.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { Box, styled, Tooltip } from "@mui/material";
// a plugin!

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import CustomCode from "@/app/(main)/schedule/CustomCssWrap";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import {
  getScheduleList,
  MergedSchedule,
} from "@/app/actions/schedule/getScheduleListAction";

interface IProps {
  me: GetMeResponse;
  scheduleList: MergedSchedule;
  calendarRef: RefObject<FullCalendar | null>;
}
export default function ScheduleCalendar(props: IProps) {
  const { me, scheduleList, calendarRef } = props;
  //   const calendarRef = useRef<FullCalendar>(null);

  const [title, setTitle] = useState(calendarRef.current?.getApi().view.title);

  // 현재 보이는 타이틀 갱신
  const updateTitle = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      //   console.log("calendarApi.view.title", calendarApi.view.title);
      setTitle(calendarApi.view.title);
    }
  };

  useEffect(() => {
    updateTitle();
  }, []);

  const { data } = useQuery({
    queryKey: ["scheduleList"],
    queryFn: async () => {
      const res = await getScheduleList({
        schoolId: me.data?.schoolId as string,
      });
      if (res.code !== "SUCCESS") throw new Error(res.message);
      return res.result;
    },
    initialData: scheduleList,
    // enabled
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 0);
  }, []);

  useEffect(() => {
    if (ready) {
      updateTitle();
    }
  }, [ready]);

  // "08.15.(금)" → "2025-08-15"
  function formatDateToISO(year: number, dateStr: string) {
    const [month, day] = dateStr.split(".").map((v) => v.trim());
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // 하루 차이인지 체크
  function isNextDay(dateA: string, dateB: string) {
    const currentYear = new Date().getFullYear();
    const toDate = (d: string) => {
      const [month, day] = d.split(".");
      return new Date(currentYear, Number(month) - 1, Number(day));
    };
    return (
      toDate(dateB).getTime() - toDate(dateA).getTime() === 24 * 60 * 60 * 1000
    );
  }

  const events = useMemo(() => {
    if (!data) return [];

    const currentYear = new Date().getFullYear();

    // month별 데이터 합치기
    const allSchedules = Object.values(data).flat();

    if (allSchedules.length === 0) return [];

    // 날짜 순 정렬
    allSchedules.sort((a, b) => {
      const dateA = new Date(formatDateToISO(currentYear, a.date)).getTime();
      const dateB = new Date(formatDateToISO(currentYear, b.date)).getTime();
      return dateA - dateB;
    });

    const result: {
      title: string;
      start: string;
      end?: string;
      from: "holiday" | "schedule";
    }[] = [];

    let tempStart = allSchedules[0].date;
    let tempEnd = allSchedules[0].date;
    let tempName = allSchedules[0].scheduleName;
    let tempFrom = allSchedules[0].from;

    for (let i = 1; i <= allSchedules.length; i++) {
      const curr = allSchedules[i];
      const prev = allSchedules[i - 1];

      const isConsecutive =
        curr &&
        curr.scheduleName === tempName &&
        curr.from === tempFrom &&
        isNextDay(prev.date, curr.date);

      if (isConsecutive) {
        tempEnd = curr.date;
      } else {
        if (tempStart !== tempEnd) {
          result.push({
            title: tempName,
            start: formatDateToISO(currentYear, tempStart),
            end: formatDateToISO(currentYear, tempEnd),
            from: tempFrom,
          });
        } else {
          result.push({
            title: tempName,
            start: formatDateToISO(currentYear, tempStart),
            from: tempFrom,
          });
        }

        if (curr) {
          tempStart = curr.date;
          tempEnd = curr.date;
          tempName = curr.scheduleName;
          tempFrom = curr.from;
        }
      }
    }

    return result;
  }, [data]);

  if (ready === false)
    return <Box sx={{ minHeight: "870px", backgroundColor: "#fff" }} />;

  return (
    <Wrapper>
      <CustomCode />
      <FullCalendar
        datesSet={updateTitle}
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
        customButtons={{
          //   today: {
          //     text: `오늘`, // ✅ 여기서 커스텀 텍스트
          //     click: (e) => {
          //       // 원래 today 기능 실행
          //       const calendarApi = calendarRef.current?.getApi();
          //       calendarApi?.today();
          //     },
          //   },
          myButton: {
            text: "커스텀버튼",
            click: () => alert("클릭됨!"),
          },
          //   nextArrow: {
          //     text: `<img src="${Arrow}" alt="next" style="width:16px;height:16px;margin-left:4px;" />`,
          //     click: () => {
          //       const calendarApi = calendarRef.current?.getApi();
          //       calendarApi?.next();
          //     },
          //   },
        }}
        // dateClick={(arg) => {
        //   alert(`${arg.dateStr}에 일정을 추가하세요!`);
        //   // 나중에 모달 열기 함수 호출로 교체 가능
        //   // openScheduleModal(arg.dateStr);
        // }}
        editable
        selectable={true} // ← 드래그 선택 가능
        selectMirror={true} // ← 선택 영역 미리보기
        select={(info) => {
          alert(
            `${dayjs(info.startStr).format("YYYY-MM-DD")}부터 ${dayjs(info.endStr).subtract(1, "days").format("YYYY-MM-DD")}까지 일정을 추가하세요!`,
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
