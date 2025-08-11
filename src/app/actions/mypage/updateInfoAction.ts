"use server";

import { z } from "zod";

import { updateInfoSchema } from "@/app/actions/mypage/mypageSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type UpdateInfoRequest = z.infer<typeof updateInfoSchema>;
export type UpdateInfoResponse = Awaited<ReturnType<typeof updateInfo>>;

export async function updateInfo(request: UpdateInfoRequest) {
  const validated = updateInfoSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, teacherName, teacherEmail, teacherPhone } = validated.data;

  const updateRes = await mysqlPrisma.school.update({
    where: {
      schoolId,
    },
    data: {
      teacherEmail,
      teacherName,
      teacherPhone: teacherPhone.replaceAll("-", ""),
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
