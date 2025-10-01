"use server";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import z from "zod";

import { getUnCheckedStatisticSchema } from "@/app/actions/statistic/statisticSchema";
import { mysqlPrisma } from "@/libs/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);

export type GetUnCheckedStatisticRequest = z.infer<
  typeof getUnCheckedStatisticSchema
>;

export type GetUnCheckedStatisticResponse = Awaited<
  ReturnType<typeof getUnCheckedStatistic>
>;

export async function getUnCheckedStatistic(
  request: GetUnCheckedStatisticRequest,
) {
  // 1. 요청 검증
  const validated = getUnCheckedStatisticSchema.safeParse(request);
  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId } = validated.data;

  // 오늘 날짜 문자열
  const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  // 오늘 dayjs 객체 (한국 시간대가 필요하면 .tz("Asia/Seoul") 추가)
  const today = dayjs(todayStr);

  // 최근 7일 워킹데이(평일) 구하는 함수 (오늘 포함 역순)
  function getLast7WorkingDays(todayStr: string): string[] {
    const dates: string[] = [];
    let date = dayjs(todayStr);

    for (let i = 0; i < 14 && dates.length < 7; i++) {
      const day = date.day(); // 0=일요일, 6=토요일
      if (day !== 0 && day !== 6) {
        dates.push(date.format("YYYY-MM-DD"));
      }
      date = date.subtract(1, "day");
    }

    return dates.reverse();
  }

  const last7WorkingDays = getLast7WorkingDays(todayStr);

  // holiday 체크 (오늘 날짜)
  // dayjs(todayStr).toDate() 사용
  const isHoliday = await mysqlPrisma.holiday.findFirst({
    where: {
      holidayStatus: true,
      holidayAt: dayjs(todayStr).toDate(),
    },
  });

  if (isHoliday) {
    return {
      code: "SUCCESS" as const,
      data: [],
    };
  }

  // 오늘 유효한 스케줄 조회 (복수)
  const schedules = await mysqlPrisma.schedules.findMany({
    where: {
      schoolId: schoolId,
      scheduleStatus: true,
      scheduleAt: new Date(todayStr),
    },
    select: {
      scheduleTarget: true,
      schoolId: true,
    },
  });

  // console.log("schedules", schedules);

  type ExcludeMap = Map<string, number[] | "all">;
  const excludeMap: ExcludeMap = new Map();

  for (const schedule of schedules) {
    if (schedule.scheduleTarget === "all") {
      excludeMap.set(schedule.schoolId, "all");
    } else {
      const targets = schedule.scheduleTarget
        .split(/[\s,]+/)
        .map((x) => Number(x.trim()))
        .filter((x) => !isNaN(x));
      const prev = excludeMap.get(schedule.schoolId);
      if (prev === "all") {
        excludeMap.set(schedule.schoolId, "all");
      } else {
        excludeMap.set(
          schedule.schoolId,
          prev ? [...prev, ...targets] : targets,
        );
      }
    }
  }

  // console.log("excludeMap", excludeMap);

  // 제외조건을 SQL WHERE 절로 변환
  function buildExcludeConditionSQL(excludeMap: ExcludeMap): string {
    if (excludeMap.size === 0) return "1=1";
    const conditions: string[] = [];
    for (const [schoolId, excludeGrades] of excludeMap.entries()) {
      if (excludeGrades === "all") {
        conditions.push(`NOT (s.school_id = '${schoolId}')`);
      } else {
        const gradesStr = excludeGrades.join(",");
        conditions.push(
          `NOT (s.school_id = '${schoolId}' AND s.student_grade IN (${gradesStr}))`,
        );
      }
    }
    return conditions.length > 0 ? conditions.join(" AND ") : "1=1";
  }
  const excludeConditionSQL = buildExcludeConditionSQL(excludeMap);
  const last7WorkingDaysStr = last7WorkingDays.map((d) => `'${d}'`).join(",");

  // 최근 7일 워킹데이 중 brushed_status = 'No' 학생 조회 (exclude 조건 반영)
  // const unCheckedListRaw = await mysqlPrisma.$queryRawUnsafe<
  //   {
  //     student_id: string;
  //     student_name: string;
  //     student_grade: number;
  //     student_number: number;
  //     student_class: string;
  //     student_gender: "male" | "female";
  //     brushed_at: Date;
  //   }[]
  // >(
  //   `
  //   SELECT
  //     s.student_id,
  //     s.student_name,
  //     s.student_grade,
  //     s.student_class,
  //     s.student_number,
  //     s.student_gender,
  //     MAX(b.brushed_at) AS brushed_at
  //   FROM Student s
  //   JOIN Brushed b ON s.student_id = b.student_id
  //   WHERE b.brushed_status = 'No'
  //     AND s.school_id = ?
  //     AND DATE(b.brushed_at) IN (${last7WorkingDaysStr})
  //     AND s.student_status = true
  //   GROUP BY s.student_id, s.student_name, s.student_grade, s.student_class, s.student_gender, s.student_number
  //   ORDER BY student_grade ASC, CAST(student_class AS UNSIGNED) ASC, student_number ASC
  // `,
  //   schoolId,
  // );

  const unCheckedListRaw = await mysqlPrisma.$queryRawUnsafe<
    {
      student_id: string;
      student_name: string;
      student_grade: number;
      student_number: number;
      student_class: string;
      student_gender: "male" | "female";
    }[]
  >(
    `
  SELECT 
    s.student_id, 
    s.student_name, 
    s.student_grade, 
    s.student_class, 
    s.student_number,
    s.student_gender
  FROM Student s
  WHERE s.school_id = ?
    AND s.student_status = true
    -- 최근 5일간 단 한 번도 Ok 기록이 없는 학생만
    AND NOT EXISTS (
      SELECT 1
      FROM Brushed b
      WHERE b.student_id = s.student_id
        AND DATE(b.brushed_at) IN (${last7WorkingDaysStr})
        AND b.brushed_status = 'Ok'
    )
  ORDER BY s.student_grade ASC, CAST(s.student_class AS UNSIGNED) ASC, s.student_number ASC
  `,
    schoolId,
  );

  return {
    code: "SUCCESS" as const,
    data: unCheckedListRaw,
  };
}
