"use client";

import FullCalendar from "@fullcalendar/react";
import { Box, Button, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import ScheduleCalendar from "@/app/(main)/schedule/ScheduleCalendar";
import ScheduleList from "@/app/(main)/schedule/ScheduleList";
import AddScheduleForm from "@/app/(main)/schedule/components/AddScheduleForm";
import DeleteScheduleAlert from "@/app/(main)/schedule/components/DeleteScheduleAlert";
import ScheduleHeader from "@/app/(main)/schedule/components/ScheduleHeader";
import Modal from "@/app/_components/common/Modal";
import { GetMeResponse } from "@/app/actions/auth/getMe";
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
  const [deleteId, setDeleteId] = useState("");

  const calendarRef = useRef<FullCalendar>(null);

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

  // console.log("scheduleList", scheduleList);
  const handleHoliday = async () => {
    try {
      const res = await fetchAndSaveHolidays();
      toast.success(res.message);
    } catch (error) {
      // error가 Error 타입일 경우 message 추출
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";

      console.error("handleHoliday Error:", error);
      toast.error(errorMessage); // 에러 메시지 토스트로 표시
    }
  };

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
    if (!data) return [];

    const allSchedules = Object.values(data).flat();
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
              title,
              start: formatDateToISO(runStart),
              // end: formatDateToISO(runEnd),
              end: addOneDayISO(runEnd), // 연속 바 잇고 싶으면 이걸로
              from: base.from,
            });
          } else {
            result.push({
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
          title: title0,
          start: formatDateToISO(runStart),
          end: addOneDayISO(runEnd), // 옵션
          from: base0.from as "holiday" | "schedule",
        });
      } else {
        result.push({
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
  }, [data, calendarRef]);

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
          scheduleList={scheduleList}
          calendarRef={calendarRef}
        />
      ) : (
        <ScheduleList me={me} schoolList={schoolList} />
      )}

      <Modal
        open={addModal}
        maxWidth={600}
        onClose={() => setAddModal(false)}
        children={
          <AddScheduleForm
            getSchoolResult={getSchoolResult?.result}
            onClose={() => {
              setDeleteId("");
              setAddModal(false);
            }}
            // onConfirm={handleRegist}
            onConfirm={() => {}}
          />
        }
      />

      <Modal
        isDelete
        open={deleteModal}
        maxWidth={360}
        children={
          <DeleteScheduleAlert
            onDelete={() => {}}
            // onDelete={handleDelete}
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
