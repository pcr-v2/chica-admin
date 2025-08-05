"use server";

import { z } from "zod";

import { updateSchoolStatusSchema } from "@/app/actions/school/schoolSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type UpdateSchoolStatusRequest = z.infer<
  typeof updateSchoolStatusSchema
>;

export async function UpdateSchoolStatus(request: UpdateSchoolStatusRequest) {
  const validated = updateSchoolStatusSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, schoolStatus } = validated.data;

  if (schoolId == null) {
    return {
      code: "FAIL" as const,
      message: "학교 아이디가 존재하지 않습니다.",
    };
  }

  const res = await mysqlPrisma.school.update({
    where: {
      schoolId,
    },
    data: {
      schoolStatus,
    },
  });

  if (res == null) {
    return {
      code: "FAIL" as const,
      message: "학교 상태변경에 실패했습니다.",
    };
  }

  //   revalidatePath("/student");

  return {
    code: "SUCCESS" as const,
    result: res,
  };
}
