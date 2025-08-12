"use server";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import z from "zod";

import { getChartStatisticSchema } from "@/app/actions/statistic/statisticSchema";
import { mysqlPrisma } from "@/libs/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(weekday);

export type GetLineChartStatisticRequest = z.infer<
  typeof getChartStatisticSchema
>;

export type GetLineChartStatisticResponse = Awaited<
  ReturnType<typeof getLineChartStatistic>
>;

export async function getLineChartStatistic(
  request: GetLineChartStatisticRequest,
) {
  const validated = getChartStatisticSchema.safeParse(request);
  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }
  const { schoolId, type } = validated.data;
  const todayStr = new Date().toISOString().split("T")[0];
  const today = dayjs(todayStr).add(9, "hour");

  // 1. 공휴일 리스트
  const startDate =
    type === "day" ? today.subtract(14, "day") : today.subtract(14 * 7, "day");
  const endDate = today;

  // 공휴일 조회 시, 시간 범위 제대로 잡기
  const holidays = await mysqlPrisma.holiday.findMany({
    where: {
      holidayStatus: true,
      holidayAt: {
        gte: dayjs(startDate).toDate(), // 00:00:00 시작
        lte: dayjs(endDate).toDate(), // 23:59:59 끝
      },
    },
    select: { holidayAt: true },
  });

  // console.log("hol2222idays", holidays);

  const holidayDates = new Set(
    holidays.map((h) => dayjs(h.holidayAt).format("YYYY-MM-DD")),
  );

  //   console.log("holidays", holidays);

  // 2. 스케줄 휴일 리스트
  const schedules = await mysqlPrisma.schedules.findMany({
    where: {
      schoolId,
      scheduleStatus: true,
      scheduleAt: {
        gte: new Date(dayjs(startDate).toISOString()),
        lte: new Date(dayjs(endDate).toISOString()),
      },
    },
    select: {
      scheduleAt: true,
      scheduleTarget: true,
    },
  });

  // console.log("schedules2222", schedules);

  // 3. 스케줄 휴일 맵 생성
  const scheduleHolidayMap = new Map<string, string>();
  for (const schedule of schedules) {
    scheduleHolidayMap.set(
      dayjs(schedule.scheduleAt).format("YYYY-MM-DD"),
      schedule.scheduleTarget,
    );
  }

  // 4. 학생 학년 리스트 조회 (중복 제거)
  const studentGrades = await mysqlPrisma.student
    .findMany({
      where: { schoolId },
      distinct: ["studentGrade"],
      select: { studentGrade: true },
    })
    .then((res) => res.map((r) => r.studentGrade));

  // 5. 워킹데이 계산 함수 (공휴일 및 스케줄 휴일 제외)
  function getLastWorkingDaysFiltered(
    todayStr: string,
    holidayDates: Set<string>,
    scheduleHolidayMap: Map<string, string>,
    studentGrades: number[],
  ): string[] {
    const dates: string[] = [];
    let date = dayjs(todayStr);

    for (let i = 0; i < 20 && dates.length < 5; i++) {
      const day = date.day(); // 0=일, 6=토
      const dateStr = date.format("YYYY-MM-DD");

      if (day !== 0 && day !== 6) {
        if (!holidayDates.has(dateStr)) {
          const scheduleTarget = scheduleHolidayMap.get(dateStr);
          const isScheduleHoliday =
            scheduleTarget === "all" ||
            (scheduleTarget
              ? scheduleTarget
                  .split(",")
                  .map((x) => Number(x.trim()))
                  .some((grade) => studentGrades.includes(grade))
              : false);

          if (!isScheduleHoliday) {
            dates.push(dateStr);
          }
        }
      }
      date = date.subtract(1, "day");
    }

    return dates.reverse();
  }

  // 6. 주차 계산 함수 (기존 유지)
  interface WeekRange {
    label: string;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
  }

  function getMonthWeekNumber(date: dayjs.Dayjs) {
    const monthStart = date.startOf("month"); // 해당 월 1일
    const weekStart = date.startOf("isoWeek"); // 주 시작일 (월요일 기준)

    // 월 시작일의 주 시작일 (월요일)
    const monthWeekStart = monthStart.startOf("isoWeek");

    // 두 주 시작일 간 차이 (주 단위)
    const weekNumber = weekStart.diff(monthWeekStart, "week") + 1; // 1부터 시작

    return weekNumber;
  }

  function getLastWeeksWithWedCheck(count: number): WeekRange[] {
    const weeks: WeekRange[] = [];
    let currMonday = today.startOf("isoWeek");

    for (let i = 0; i < count * 2; i++) {
      const weekStart = currMonday.subtract(i, "week");
      const weekEnd = weekStart.add(6, "day");

      const month = weekStart.month() + 1;
      const weekNumber = getMonthWeekNumber(weekStart);

      const label = `${month}월 ${weekNumber}주차`;

      weeks.push({
        label,
        startDate: weekStart,
        endDate: weekEnd,
      });

      if (weeks.length >= count) break;
    }

    return weeks.reverse();
  }

  // 7. xLabels 및 periodRanges 생성 (공휴일/스케줄 휴일 제외)
  let xLabels: string[] = [];
  let periodRanges: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }[] = [];
  const currentYearPrefix = `${today.year()}-`;

  if (type === "day") {
    const filteredDays = getLastWorkingDaysFiltered(
      todayStr,
      holidayDates,
      scheduleHolidayMap,
      studentGrades,
    );

    xLabels = filteredDays;
    periodRanges = filteredDays.map((d) => ({
      startDate: dayjs(d),
      endDate: dayjs(d).endOf("day"),
    }));

    xLabels = filteredDays;
    xLabels = xLabels.map((label) =>
      label.replace(new RegExp(`^${currentYearPrefix}`), ""),
    );
  } else {
    const lastWeeks = getLastWeeksWithWedCheck(10); // 넉넉히 생성
    // 각 주에 공휴일/스케줄 휴일 제외 후 평일이 하나라도 있으면 포함
    const filteredWeeks = lastWeeks.filter((week) => {
      for (
        let d = week.startDate;
        d.isBefore(week.endDate) || d.isSame(week.endDate);
        d = d.add(1, "day")
      ) {
        const dStr = d.format("YYYY-MM-DD");
        const isHoliday = holidayDates.has(dStr);
        const scheduleTarget = scheduleHolidayMap.get(dStr);
        const isScheduleHoliday =
          scheduleTarget === "all" ||
          (scheduleTarget
            ? scheduleTarget
                .split(",")
                .map((x) => Number(x.trim()))
                .some((grade) => studentGrades.includes(grade))
            : false);

        const day = d.day();
        const isWeekend = day === 0 || day === 6;

        if (!isHoliday && !isScheduleHoliday && !isWeekend) {
          return true;
        }
      }
      return false;
    });

    const finalWeeks = filteredWeeks.slice(-5);

    xLabels = finalWeeks.map((w) => w.label);
    periodRanges = finalWeeks.map((w) => ({
      startDate: w.startDate,
      endDate: w.endDate.endOf("day"),
    }));
  }

  // 8. 양치율 계산 (전체, 남자, 여자)
  const rates: number[] = [];
  const maleRates: number[] = [];
  const femaleRates: number[] = [];

  for (const period of periodRanges) {
    // 전체
    const brushedStats = await mysqlPrisma.$queryRawUnsafe<
      {
        brushedOkCount: bigint;
        brushedTotalCount: bigint;
      }[]
    >(
      `
      SELECT
        SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) AS brushedOkCount,
        COUNT(CASE WHEN b.brushed_status IN ('Ok','No') THEN 1 END) AS brushedTotalCount
      FROM Brushed b
      JOIN Student s ON b.student_id = s.student_id
      WHERE s.school_id = ?
        AND b.brushed_at BETWEEN ? AND ?
        AND DATE(b.brushed_at) NOT IN (${
          [...holidayDates].map((d) => `'${d}'`).join(",") || "1"
        })
        AND NOT EXISTS (
          SELECT 1 FROM Schedules sc
          WHERE sc.school_id = s.school_id
            AND sc.schedule_at = DATE(b.brushed_at)
            AND (
              sc.schedule_target = 'all'
              OR FIND_IN_SET(CAST(s.student_grade AS CHAR), sc.schedule_target)
            )
        )
    `,
      schoolId,
      new Date(dayjs(period.startDate).toISOString()),
      new Date(dayjs(period.endDate).toISOString()),
    );

    // 남자
    const brushedStatsMale = await mysqlPrisma.$queryRawUnsafe<
      {
        brushedOkCount: bigint;
        brushedTotalCount: bigint;
      }[]
    >(
      `
      SELECT
        SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) AS brushedOkCount,
        COUNT(CASE WHEN b.brushed_status IN ('Ok','No') THEN 1 END) AS brushedTotalCount
      FROM Brushed b
      JOIN Student s ON b.student_id = s.student_id
      WHERE s.school_id = ?
        AND s.student_gender = 'male'
        AND b.brushed_at BETWEEN ? AND ?
        AND DATE(b.brushed_at) NOT IN (${
          [...holidayDates].map((d) => `'${d}'`).join(",") || "1"
        })
        AND NOT EXISTS (
          SELECT 1 FROM Schedules sc
          WHERE sc.school_id = s.school_id
            AND sc.schedule_at = DATE(b.brushed_at)
            AND (
              sc.schedule_target = 'all'
              OR FIND_IN_SET(CAST(s.student_grade AS CHAR), sc.schedule_target)
            )
        )
    `,
      schoolId,
      new Date(dayjs(period.startDate).toISOString()),
      new Date(dayjs(period.endDate).toISOString()),
    );

    // 여자
    const brushedStatsFemale = await mysqlPrisma.$queryRawUnsafe<
      {
        brushedOkCount: bigint;
        brushedTotalCount: bigint;
      }[]
    >(
      `
      SELECT
        SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) AS brushedOkCount,
        COUNT(CASE WHEN b.brushed_status IN ('Ok','No') THEN 1 END) AS brushedTotalCount
      FROM Brushed b
      JOIN Student s ON b.student_id = s.student_id
      WHERE s.school_id = ?
        AND s.student_gender = 'female'
        AND b.brushed_at BETWEEN ? AND ?
        AND DATE(b.brushed_at) NOT IN (${
          [...holidayDates].map((d) => `'${d}'`).join(",") || "1"
        })
        AND NOT EXISTS (
          SELECT 1 FROM Schedules sc
          WHERE sc.school_id = s.school_id
            AND sc.schedule_at = DATE(b.brushed_at)
            AND (
              sc.schedule_target = 'all'
              OR FIND_IN_SET(CAST(s.student_grade AS CHAR), sc.schedule_target)
            )
        )
    `,
      schoolId,
      new Date(dayjs(period.startDate).toISOString()),
      new Date(dayjs(period.endDate).toISOString()),
    );

    // 계산 함수
    function calcRate(
      stats: { brushedOkCount: bigint; brushedTotalCount: bigint }[],
    ) {
      if (stats.length === 0 || stats[0].brushedTotalCount === BigInt(0))
        return 0;
      return (
        (Number(stats[0].brushedOkCount) / Number(stats[0].brushedTotalCount)) *
        100
      );
    }

    rates.push(Number(calcRate(brushedStats).toFixed(1)));
    maleRates.push(Number(calcRate(brushedStatsMale).toFixed(1)));
    femaleRates.push(Number(calcRate(brushedStatsFemale).toFixed(1)));
  }

  //   console.log("라벨", xLabels);
  //   console.log("전체 rates", rates);
  //   console.log("남자 rates", maleRates);
  //   console.log("여자 rates", femaleRates);

  return {
    code: "SUCCESS" as const,
    data: {
      type,
      labels: xLabels,
      rates,
      maleRates,
      femaleRates,
    },
  };
}
