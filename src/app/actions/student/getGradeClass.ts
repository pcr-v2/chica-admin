"use server";

import { z } from "zod";

import { getGradeClassSchema } from "@/app/actions/student/studentSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type GetGradeClassRequest = z.infer<typeof getGradeClassSchema>;
export type GetGradeClassResponse = Awaited<ReturnType<typeof getGradeClass>>;

export async function getGradeClass(request: GetGradeClassRequest) {
  const validated = getGradeClassSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const result = await mysqlPrisma.$queryRawUnsafe<
    {
      studentGrade: number;
      classList: string;
    }[]
  >(
    `
    SELECT
    student_grade AS studentGrade,
    GROUP_CONCAT(DISTINCT student_class ORDER BY student_class) AS classList
    FROM Student
    WHERE school_id = ? AND student_status = 1
    GROUP BY student_grade
    ORDER BY student_grade;
    `,
    validated.data.schoolId,
  );

  if (!result) {
    return {
      code: "INVALID_CREDENTIAL" as const,
      message: "학년,반 리스트를 가져오는중 문제가 발생했습니다.",
    };
  }

  const parsedResult = result?.map((row) => ({
    studentGrade: row.studentGrade,
    classList: row.classList?.split(",") ?? [],
  }));

  return {
    code: "SUCCESS" as const,
    message: "학년,반 리스트를 가져왔습니다.",
    result: parsedResult,
  };
}
