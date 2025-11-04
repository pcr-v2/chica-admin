"use server";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import z from "zod";

import { getTotalStatisticSchema } from "@/app/actions/statistic/statisticSchema";
import { mysqlPrisma } from "@/libs/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(weekday);

export type GetTotalStatisticRequest = z.infer<typeof getTotalStatisticSchema>;
export type GetTotalStatisticResponse = Awaited<
  ReturnType<typeof getTotalStatistic>
>;

/** 주말 판별 */
function isWeekend(date: dayjs.Dayjs) {
  const d = date.day();
  return d === 0 || d === 6;
}

/** 월 주차 계산 (예: 9월 3주차) */
function getMonthWeekLabel(date: dayjs.Dayjs) {
  const monthStart = date.startOf("month");
  const weekStart = date.startOf("isoWeek");
  const monthWeekStart = monthStart.startOf("isoWeek");
  const weekNumber = weekStart.diff(monthWeekStart, "week") + 1;
  const month = date.month() + 1;
  return `${month}월 ${weekNumber}주차`;
}

/** 퍼센트 계산 (BigInt 대응 안전 버전) */
function calcRate(ok: bigint, total: bigint) {
  const okNum = Number(ok);
  const totalNum = Number(total);
  if (!totalNum || totalNum === 0) return 0;
  return Number(((okNum / totalNum) * 100).toFixed(1));
}

export async function getTotalStatistic(request: GetTotalStatisticRequest) {
  const validated = getTotalStatisticSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, gender, searchDateType, searchRange, targetGrade } =
    validated.data;

  const startAt = searchRange.startAt
    ? dayjs(searchRange.startAt)
    : dayjs().subtract(30, "day");
  const endAt = searchRange.endAt ? dayjs(searchRange.endAt) : dayjs();

  // 🏫 학교 정보로 학년 구분
  const school = await mysqlPrisma.school.findUnique({
    where: { schoolId },
    select: { schoolLevel: true },
  });
  if (!school) throw new Error("학교 정보를 찾을 수 없습니다.");
  const gradeList =
    school.schoolLevel === "elementary" ? [1, 2, 3, 4, 5, 6] : [1, 2, 3];

  // 🗓️ 공휴일 + 스케줄 조회
  const holidays = await mysqlPrisma.holiday.findMany({
    where: {
      holidayStatus: true,
      holidayAt: { gte: startAt.toDate(), lte: endAt.toDate() },
    },
    select: { holidayAt: true },
  });

  const schedules = await mysqlPrisma.schedules.findMany({
    where: {
      schoolId,
      scheduleStatus: true,
      scheduleAt: { gte: startAt.toDate(), lte: endAt.toDate() },
    },
    select: { scheduleAt: true },
  });

  const holidaySet = new Set(
    holidays.map((h) => dayjs(h.holidayAt).format("YYYY-MM-DD")),
  );
  const scheduleSet = new Set(
    schedules.map((s) => dayjs(s.scheduleAt).format("YYYY-MM-DD")),
  );

  /** 공휴일/스케줄/주말 제외 */
  const isWorkingDay = (date: dayjs.Dayjs) => {
    const dStr = date.format("YYYY-MM-DD");
    if (holidaySet.has(dStr)) return false;
    if (isWeekend(date)) return false;
    if (scheduleSet.has(dStr)) return false;
    return true;
  };

  // ✅ X축 라벨 및 구간 설정
  let labels: string[] = [];
  const periods: { start: dayjs.Dayjs; end: dayjs.Dayjs }[] = [];

  if (searchDateType === "daily") {
    let cursor = startAt.startOf("day");
    while (cursor.isBefore(endAt) || cursor.isSame(endAt, "day")) {
      if (isWorkingDay(cursor)) {
        labels.push(cursor.format("YYYY-MM-DD"));
        periods.push({
          start: cursor.startOf("day"),
          end: cursor.endOf("day"),
        });
      }
      cursor = cursor.add(1, "day");
    }
  }

  if (searchDateType === "weekly") {
    let cursor = startAt.startOf("isoWeek");
    while (cursor.isBefore(endAt)) {
      const weekStart = cursor.startOf("isoWeek");
      const weekEnd = cursor.endOf("isoWeek");
      labels.push(getMonthWeekLabel(weekStart));
      periods.push({ start: weekStart, end: weekEnd });
      cursor = cursor.add(1, "week");
    }
  }

  if (searchDateType === "monthly") {
    let cursor = startAt.startOf("month");
    while (cursor.isBefore(endAt) || cursor.isSame(endAt, "month")) {
      const monthStart = cursor.startOf("month");
      const monthEnd = cursor.endOf("month");
      labels.push(monthStart.format("YYYY-MM"));
      periods.push({ start: monthStart, end: monthEnd });
      cursor = cursor.add(1, "month");
    }
  }

  // ✅ 학년별 성별별 계산
  const result: {
    grade: number;
    maleValues: number[];
    femaleValues: number[];
    totalValues: number[];
  }[] = [];

  const targetGrades =
    targetGrade === "total"
      ? gradeList
      : gradeList.filter((g) => g === Number(targetGrade));

  for (const grade of targetGrades) {
    const maleValues: number[] = [];
    const femaleValues: number[] = [];
    const totalValues: number[] = [];

    for (const p of periods) {
      const { start, end } = p;

      if (gender === "total") {
        // ✅ 전체용 쿼리 (성별 구분 없이)
        const totalStat = await mysqlPrisma.$queryRawUnsafe<
          { okCount: bigint; totalCount: bigint }[]
        >(
          `
            SELECT
              SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) AS okCount,
              COUNT(CASE WHEN b.brushed_status IN ('Ok','No') THEN 1 ELSE NULL END) AS totalCount
            FROM Brushed b
            JOIN Student s ON b.student_id = s.student_id
            WHERE s.school_id = ?
              AND s.student_grade = ?
              AND b.brushed_at BETWEEN ? AND ?
              AND NOT EXISTS (
                SELECT 1 FROM Schedules sc 
                WHERE sc.school_id = s.school_id 
                  AND sc.schedule_status = 1
                  AND sc.schedule_at = DATE(b.brushed_at)
              )
              AND NOT EXISTS (
                SELECT 1 FROM Holiday h 
                WHERE h.holiday_status = 1
                  AND h.holiday_at = DATE(b.brushed_at)
              )
          `,
          schoolId,
          grade,
          start.toDate(),
          end.toDate(),
        );

        const totalOk = totalStat[0]?.okCount || BigInt(0);
        const totalCnt = totalStat[0]?.totalCount || BigInt(0);
        totalValues.push(calcRate(totalOk, totalCnt));
      } else {
        // ✅ 기존 성별별 쿼리
        const [maleStat, femaleStat] = await Promise.all([
          mysqlPrisma.$queryRawUnsafe<
            { okCount: bigint; totalCount: bigint }[]
          >(
            `
            SELECT
              SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) AS okCount,
              COUNT(CASE WHEN b.brushed_status IN ('Ok','No') THEN 1 ELSE NULL END) AS totalCount
            FROM Brushed b
            JOIN Student s ON b.student_id = s.student_id
            WHERE s.school_id = ?
              AND s.student_grade = ?
              AND s.student_gender = 'male'
              AND b.brushed_at BETWEEN ? AND ?
          `,
            schoolId,
            grade,
            start.toDate(),
            end.toDate(),
          ),
          mysqlPrisma.$queryRawUnsafe<
            { okCount: bigint; totalCount: bigint }[]
          >(
            `
            SELECT
              SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) AS okCount,
              COUNT(CASE WHEN b.brushed_status IN ('Ok','No') THEN 1 ELSE NULL END) AS totalCount
            FROM Brushed b
            JOIN Student s ON b.student_id = s.student_id
            WHERE s.school_id = ?
              AND s.student_grade = ?
              AND s.student_gender = 'female'
              AND b.brushed_at BETWEEN ? AND ?
          `,
            schoolId,
            grade,
            start.toDate(),
            end.toDate(),
          ),
        ]);

        const maleOk = maleStat[0]?.okCount || BigInt(0);
        const maleTotal = maleStat[0]?.totalCount || BigInt(0);
        const femaleOk = femaleStat[0]?.okCount || BigInt(0);
        const femaleTotal = femaleStat[0]?.totalCount || BigInt(0);

        maleValues.push(calcRate(maleOk, maleTotal));
        femaleValues.push(calcRate(femaleOk, femaleTotal));
      }
    }

    result.push({ grade, maleValues, femaleValues, totalValues });
  }

  // ✅ gender별 리턴 분기
  let data;
  if (gender === "male") {
    data = {
      type: searchDateType,
      labels,
      grades: result.map((g) => ({
        grade: g.grade,
        maleValues: g.maleValues,
        femaleValues: [],
        totalValues: [],
      })),
    };
  } else if (gender === "female") {
    data = {
      type: searchDateType,
      labels,
      grades: result.map((g) => ({
        grade: g.grade,
        maleValues: [],
        femaleValues: g.femaleValues,
        totalValues: [],
      })),
    };
  } else if (gender === "both") {
    data = {
      type: searchDateType,
      labels,
      grades: result.map((g) => ({
        grade: g.grade,
        maleValues: g.maleValues,
        femaleValues: g.femaleValues,
        totalValues: [],
      })),
    };
  } else if (gender === "total") {
    data = {
      type: searchDateType,
      labels,
      grades: result.map((g) => ({
        grade: g.grade,
        maleValues: [],
        femaleValues: [],
        totalValues: g.totalValues,
      })),
    };
  }

  return {
    code: "SUCCESS" as const,
    data,
  };
}
