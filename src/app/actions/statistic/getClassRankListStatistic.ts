"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import z from "zod";

import { mysqlPrisma } from "@/libs/prisma";

dayjs.extend(utc);
dayjs.extend(weekday);

// 요청 스키마
const getSchoolClassStatisticSchema = z.object({
  schoolId: z.string(),
  isTotal: z.boolean(),
  searchRange: z.object({
    startAt: z.string().optional(),
    endAt: z.string().optional(),
  }),
});

export type GetClassRankListStatisticRequest = z.infer<
  typeof getSchoolClassStatisticSchema
>;
export type GetClassRankListStatisticResponse = Awaited<
  ReturnType<typeof getClassRankListStatistic>
>;

export async function getClassRankListStatistic(
  request: GetClassRankListStatisticRequest,
) {
  const validated = getSchoolClassStatisticSchema.safeParse(request);
  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, isTotal, searchRange } = validated.data;

  // ======================
  // 1. 조회 기간 결정
  // ======================
  let gteDate: Date | null = null;
  let lteDate: Date | null = null;

  if (isTotal) {
    // 전체기간 → 조건 없음
    gteDate = null;
    lteDate = null;
  } else if (searchRange.startAt && searchRange.endAt) {
    // searchRange 지정됨
    gteDate = dayjs.utc(searchRange.startAt).startOf("day").toDate();
    lteDate = dayjs.utc(searchRange.endAt).endOf("day").toDate();
  } else {
    return {
      code: "VALIDATION_ERROR" as const,
      message: "searchRange.startAt, searchRange.endAt 값이 필요합니다.",
    };
  }

  // ======================
  // 2. 쿼리 실행
  // ======================
  const rawClassRanks = await mysqlPrisma.$queryRawUnsafe<
    {
      student_grade: number;
      student_class: string;
      percentage: number;
      grade_rank: bigint;
      school_rank: bigint;
    }[]
  >(
    `
    WITH SchoolInfo AS (
      SELECT school_id, school_level
      FROM School
      WHERE school_id = ?
    ),
    ClassStats AS (
      SELECT
        s.student_grade,
        s.student_class,
        si.school_level,
        SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) AS numerator,
        COUNT(CASE WHEN b.brushed_status IN ('Ok', 'No') THEN 1 ELSE NULL END) AS denominator,
        CASE 
          WHEN COUNT(CASE WHEN b.brushed_status IN ('Ok', 'No') THEN 1 ELSE NULL END) = 0 THEN 0
          ELSE ROUND(SUM(CASE WHEN b.brushed_status = 'Ok' THEN 1 ELSE 0 END) / COUNT(CASE WHEN b.brushed_status IN ('Ok', 'No') THEN 1 ELSE NULL END) * 100, 5)
        END AS percentage
      FROM Student s
      JOIN SchoolInfo si ON s.school_id = si.school_id
      LEFT JOIN Brushed b ON s.student_id = b.student_id
        ${isTotal ? "" : "AND b.brushed_at BETWEEN ? AND ?"}
      GROUP BY s.student_grade, s.student_class, si.school_level
    ),
    FilteredClasses AS (
      SELECT
        student_grade,
        student_class,
        percentage
      FROM ClassStats
      WHERE
        (
          (school_level = 'elementary' AND student_grade BETWEEN 1 AND 6)
          OR
          (school_level != 'elementary' AND student_grade BETWEEN 1 AND 3)
        )
    ),
    GradeRanked AS (
      SELECT
        student_grade,
        student_class,
        percentage,
        DENSE_RANK() OVER (PARTITION BY student_grade ORDER BY percentage DESC) AS grade_rank
      FROM FilteredClasses
    ),
    SchoolRanked AS (
      SELECT
        student_grade,
        student_class,
        percentage,
        DENSE_RANK() OVER (ORDER BY percentage DESC) AS school_rank
      FROM FilteredClasses
    )
    SELECT
      gr.student_grade,
      gr.student_class,
      gr.percentage,
      gr.grade_rank,
      sr.school_rank
    FROM GradeRanked gr
    JOIN SchoolRanked sr
      ON gr.student_grade = sr.student_grade
     AND gr.student_class = sr.student_class
    ORDER BY sr.school_rank ASC;
    `,
    ...(isTotal ? [schoolId] : [schoolId, gteDate, lteDate]),
  );

  // ======================
  // 3. 결과 반환
  // ======================
  return {
    code: "SUCCESS" as const,
    data: {
      isTotal,
      start: gteDate ? dayjs(gteDate).format("YYYY-MM-DD") : null,
      end: lteDate ? dayjs(lteDate).format("YYYY-MM-DD") : null,
      classList: rawClassRanks.map((c) => ({
        grade: c.student_grade,
        class: c.student_class,
        rate: Number(c.percentage ?? 0),
        schoolRank: Number(c.school_rank ?? 0), // gradeRank 제거
      })),
    },
  };
}
