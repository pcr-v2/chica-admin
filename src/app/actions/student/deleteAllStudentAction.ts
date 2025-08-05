"use server";

import { z } from "zod";

import { deleteAllStudentSchema } from "@/app/actions/student/studentSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type DeleteAllStudentRequest = z.infer<typeof deleteAllStudentSchema>;
export type DeleteAllStudentResponse = Awaited<
  ReturnType<typeof deleteAllStudent>
>;

export async function deleteAllStudent(request: DeleteAllStudentRequest) {
  const validated = deleteAllStudentSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId } = validated.data;

  //   console.log("schoolId", schoolId);

  //   return {
  //     code: "FAIL" as const,
  //     message: "학생 일괄 삭제하는 중 문제가 발생했습니다.",
  //   };

  const res = await mysqlPrisma.student.deleteMany({
    where: {
      schoolId: schoolId,
    },
  });

  if (res == null) {
    return {
      code: "FAIL" as const,
      message: "학생 일괄 삭제하는 중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "학생 일괄삭제를 완료 했습니다.",
    result: res,
  };
}
