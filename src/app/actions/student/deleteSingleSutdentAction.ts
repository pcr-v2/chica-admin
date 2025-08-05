"use server";

import { z } from "zod";

import { deleteStudentSchema } from "@/app/actions/student/studentSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type DeleteStudentRequest = z.infer<typeof deleteStudentSchema>;
export type DeleteStudentResponse = Awaited<
  ReturnType<typeof deleteSingleStudent>
>;

export async function deleteSingleStudent(request: DeleteStudentRequest) {
  const validated = deleteStudentSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { studentId } = validated.data;

  const res = await mysqlPrisma.student.delete({
    where: {
      studentId: studentId,
    },
  });

  if (res == null) {
    return {
      code: "FAIL" as const,
      message: "학생을 삭제하는 중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "학생을 삭제 했습니다.",
    result: res,
  };
}
