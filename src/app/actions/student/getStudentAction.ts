"use server";

import { z } from "zod";

import { getStudentSchema } from "@/app/actions/student/studentSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type getStudentRequest = z.infer<typeof getStudentSchema>;
export type GetStudentResponse = Awaited<ReturnType<typeof getStudent>>;

export async function getStudent(request: getStudentRequest) {
  const validated = getStudentSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { studentId } = validated.data;

  const res = await mysqlPrisma.student.findFirst({
    where: {
      studentId: studentId,
    },
  });

  if (res == null) {
    return {
      code: "FAIL" as const,
      message: "학생을 가져오는 중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "학생을 가져왔습니다.",
    result: res,
  };
}
