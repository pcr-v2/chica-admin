"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { updateStudentStatusSchema } from "@/app/actions/student/studentSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type UpdateStudentStatusRequest = z.infer<
  typeof updateStudentStatusSchema
>;

export async function updateStudentStatus(request: UpdateStudentStatusRequest) {
  const validated = updateStudentStatusSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { studentId, studentStatus } = validated.data;

  if (studentId == null) {
    return {
      code: "FAIL" as const,
      message: "학생 아이디가 존재하지 않습니다.",
    };
  }

  const res = await mysqlPrisma.student.update({
    where: {
      studentId,
    },
    data: {
      studentStatus,
    },
    select: {
      id: true,
      schoolId: true,
      studentGrade: true,
      studentClass: true,
      studentNumber: true,
      studentGender: true,
      studentName: true,
      studentStatus: true,
      studentId: true,
      school: {
        select: {
          schoolName: true,
        },
      },
    },
  });

  if (res == null) {
    return {
      code: "FAIL" as const,
      message: "학생 상태변경에 실패했습니다.",
    };
  }

  revalidatePath("/student");

  return {
    code: "SUCCESS" as const,
    result: res,
  };
}
