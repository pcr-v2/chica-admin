"use server";

import { z } from "zod";

import { updateStudentSchema } from "@/app/actions/student/studentSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type UpdateStudentRequest = z.infer<typeof updateStudentSchema>;
export type UpdateStudentResponse = Awaited<ReturnType<typeof updateStudent>>;

export async function updateStudent(request: UpdateStudentRequest) {
  const validated = updateStudentSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { studentId, students } = validated.data;

  const newStudentGender = students[0].studentGender;
  const newStudentName = students[0].studentName;
  //   console.log("validated.data", validated.data);
  //   return {
  //     code: "FAIL",
  //     message: "가나다라",
  //   };
  const updateRes = await mysqlPrisma.student.update({
    where: {
      studentId,
    },
    data: {
      studentGender: newStudentGender,
      studentName: newStudentName,
    },
  });

  if (updateRes == null) {
    return {
      code: "FAIL" as const,
      message: "수정 중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "수정이 완료되었습니다.",
    result: updateRes,
  };
}
