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

export type GetBarChartStatisticRequest = z.infer<
  typeof getChartStatisticSchema
>;
export type GetBarChartStatisticResponse = Awaited<
  ReturnType<typeof getBarChartStatistic>
>;

function isWeekend(date: dayjs.Dayjs) {
  const d = date.day();
  return d === 0 || d === 6;
}

async function getBarChartStatistic(request: GetBarChartStatisticRequest) {
  const validated = getChartStatisticSchema.safeParse(request);
  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, type } = validated.data;

  // 1. 학교 레벨로 학년 배열 결정
  const school = await mysqlPrisma.school.findUnique({
    where: { schoolId },
    select: { schoolLevel: true },
  });
  if (!school) throw new Error("학교 정보가 없습니다");
  const grades =
    school.schoolLevel === "elementary" ? [1, 2, 3, 4, 5, 6] : [1, 2, 3];

  // 2. 공휴일·스케쥴 조회
  const todayStr = new Date().toISOString().split("T")[0];
  const today = dayjs(todayStr).add(9, "hour");
  const todayKST = dayjs().add(9, "hour");

  const startDate = today.subtract(14, "day");

  const holidays = await mysqlPrisma.holiday.findMany({
    where: {
      holidayStatus: true,
      holidayAt: { gte: startDate.toDate(), lte: today.toDate() },
    },
    select: { holidayAt: true },
  });

  //   console.log("today", todayKST.toDate());

  const holidaySet = new Set(
    holidays.map((h) => dayjs(h.holidayAt).format("YYYY-MM-DD")),
  );

  const schedules = await mysqlPrisma.schedules.findMany({
    where: {
      schoolId,
      scheduleStatus: true,
      scheduleAt: { gte: startDate.toDate(), lte: todayKST.toDate() },
    },
    select: { scheduleAt: true, scheduleTarget: true },
  });

  //   console.log("schedules", schedules);

  const scheduleMap = new Map<string, string>();
  schedules.forEach((s) =>
    scheduleMap.set(dayjs(s.scheduleAt).format("YYYY-MM-DD"), s.scheduleTarget),
  );

  // helper: 공휴일·스케쥴·주말 제외 working day 여부
  const isWorkingDay = (date: dayjs.Dayjs) => {
    const dStr = date.format("YYYY-MM-DD");
    if (holidaySet.has(dStr)) return false;
    if (isWeekend(date)) return false;
    if (scheduleMap.has(dStr)) return false;
    return true;
  };

  // helper: 비율 계산
  const getRate = async (grade: number, start: Date, end: Date) => {
    const stats = await mysqlPrisma.$queryRawUnsafe<
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
        AND s.student_grade = ?
        AND b.brushed_at BETWEEN ? AND ?
    `,
      schoolId,
      grade,
      start,
      end,
    );
    if (!stats.length || stats[0].brushedTotalCount === BigInt(0)) return 0;
    return (
      (Number(stats[0].brushedOkCount) / Number(stats[0].brushedTotalCount)) *
      100
    );
  };

  let resultRates: Record<string, number[]> = {};

  if (type === "day") {
    // 최근 14일 내 working day 2개 찾기
    const workingDays: dayjs.Dayjs[] = [];
    for (let i = 0; i < 14; i++) {
      const d = todayKST.subtract(i, "day");
      if (isWorkingDay(d)) workingDays.push(d);
      if (workingDays.length === 2) break;
    }

    // console.log(workingDays[0].startOf("day").toDate());
    // console.log(workingkDays[1].endOf("day").toDate());

    for (const grade of grades) {
      const todayRate = workingDays[0]
        ? await getRate(
            grade,
            workingDays[0].startOf("day").toDate(),
            workingDays[0].endOf("day").toDate(),
          )
        : 0;
      const yesterDayRate = workingDays[1]
        ? await getRate(
            grade,
            workingDays[1].startOf("day").toDate(),
            workingDays[1].endOf("day").toDate(),
          )
        : 0;
      if (!resultRates.todayRate) resultRates.todayRate = [];
      if (!resultRates.yesterDayRate) resultRates.yesterDayRate = [];
      resultRates.todayRate.push(Number(todayRate.toFixed(1)));
      resultRates.yesterDayRate.push(Number(yesterDayRate.toFixed(1)));
    }
  }

  if (type === "week") {
    // 이번주 / 지난주 working day 범위
    const thisWeekStart = todayKST.startOf("week").add(1, "day"); // 월요일
    const lastWeekStart = thisWeekStart.subtract(7, "day");

    const filterWorkingRange = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
      const days: dayjs.Dayjs[] = [];
      for (
        let d = start;
        d.isBefore(end) || d.isSame(end, "day");
        d = d.add(1, "day")
      ) {
        if (isWorkingDay(d)) days.push(d);
      }
      return days;
    };

    const thisWeekDays = filterWorkingRange(thisWeekStart, today);
    const lastWeekDays = filterWorkingRange(
      lastWeekStart,
      thisWeekStart.subtract(1, "day"),
    );

    for (const grade of grades) {
      const thisWeekRate =
        thisWeekDays.length > 0
          ? await getRate(
              grade,
              thisWeekDays[0].startOf("day").toDate(),
              thisWeekDays.at(-1)!.endOf("day").toDate(),
            )
          : 0;
      const lastWeekRate =
        lastWeekDays.length > 0
          ? await getRate(
              grade,
              lastWeekDays[0].startOf("day").toDate(),
              lastWeekDays.at(-1)!.endOf("day").toDate(),
            )
          : 0;
      if (!resultRates.thisWeekRate) resultRates.thisWeekRate = [];
      if (!resultRates.lastWeekRate) resultRates.lastWeekRate = [];
      resultRates.thisWeekRate.push(Number(thisWeekRate.toFixed(1)));
      resultRates.lastWeekRate.push(Number(lastWeekRate.toFixed(1)));
    }
  }

  return {
    code: "SUCCESS" as const,
    data: {
      labels: grades.map((g) => `${g}학년`),
      todayRate: resultRates.todayRate,
      yesterdayRate: resultRates.yesterDayRate,
      thisWeekRate: resultRates.thisWeekRate,
      lastWeekRate: resultRates.lastWeekRate,
    },
  };
}

export { getBarChartStatistic };
