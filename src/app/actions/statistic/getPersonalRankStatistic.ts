"use server";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import z from "zod";

import { getPersonalRankStatisticSchema } from "@/app/actions/statistic/statisticSchema";
import { mysqlPrisma } from "@/libs/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);

export type GetPersonalRankStatisticRequest = z.infer<
  typeof getPersonalRankStatisticSchema
>;

export type GetPersonalRankStatisticResponse = Awaited<
  ReturnType<typeof getPersonalRankStatistic>
>;

export async function getPersonalRankStatistic(
  request: GetPersonalRankStatisticRequest,
) {
  // 1. 요청 검증
  const validated = getPersonalRankStatisticSchema.safeParse(request);
  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, isTotal, searchRange } = validated.data;

  // 2. 날짜 범위 결정
  let gteDate: string | undefined;
  let lteDate: string | undefined;

  if (!isTotal && searchRange?.startAt && searchRange?.endAt) {
    gteDate = dayjs(searchRange.startAt).startOf("day").toISOString();
    lteDate = dayjs(searchRange.endAt).endOf("day").toISOString();
  }

  // 3. 쿼리 빌드
  const studentRankArrayRaw = await mysqlPrisma.$queryRawUnsafe<
    {
      brushed_at: Date | null;
      student_id: string;
      student_name: string;
      student_grade: number;
      student_class: string;
      student_number: number;
      percentage: number;
      student_rank: number;
      student_gender: "male" | "female";
    }[]
  >(
    `
    WITH StudentStats AS (
      SELECT
        MAX(b.brushed_at) as brushed_at, -- 가장 최근 기록만 대표로 가져오기 (없으면 NULL)
        s.student_id,
        s.student_name,
        s.student_grade,
        s.student_class,
        s.student_number,
        s.student_gender,
        ROUND(
          IF(
            COUNT(CASE WHEN b.brushed_status IN ('Ok', 'No') THEN 1 END) = 0,
            0,
            SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) / COUNT(CASE WHEN b.brushed_status IN ('Ok', 'No') THEN 1 END) * 100
          ),
          1
        ) AS percentage
      FROM Student s
      LEFT JOIN Brushed b 
        ON s.student_id = b.student_id
        ${
          isTotal
            ? "" // 전체 기간이면 날짜 조건 없음
            : "AND b.brushed_at BETWEEN ? AND ?" // 특정 기간
        }
      WHERE s.school_id = ?
      GROUP BY s.student_id, s.student_name, s.student_grade, s.student_class, s.student_gender, s.student_number
    ),
    RankedStudents AS (
      SELECT
        brushed_at,
        student_id,
        student_name,
        student_grade,
        student_class,
        student_gender,
        student_number,
        percentage,
        DENSE_RANK() OVER (ORDER BY percentage DESC) AS student_rank
      FROM StudentStats
    )
    SELECT *
    FROM RankedStudents
    WHERE student_rank <= 30
    ORDER BY student_rank ASC, student_grade ASC, CAST(student_class AS UNSIGNED) ASC, student_number ASC, student_name
  `,
    ...(isTotal ? [schoolId] : [gteDate, lteDate, schoolId]),
  );

  // 4. 후처리
  const studentRankArray = studentRankArrayRaw.map((item) => ({
    ...item,
    percentage: Number(item.percentage),
    student_rank: Number(item.student_rank), // bigint → number 변환
    brushedAt: item.brushed_at
      ? dayjs(item.brushed_at).format("YYYY년 M월")
      : null,
  }));

  return {
    code: "SUCCESS" as const,
    data: studentRankArray,
  };
}
