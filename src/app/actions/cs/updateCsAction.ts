"use server";

import { z } from "zod";

import { updateCsSchema } from "@/app/actions/cs/csSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type UpdateCsRequest = z.infer<typeof updateCsSchema>;
export type UpdateCsResponse = Awaited<ReturnType<typeof updateCs>>;

export async function updateCs(request: UpdateCsRequest) {
  const validated = updateCsSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { boardId, schoolId, title, content } = validated.data;

  const updateRes = await mysqlPrisma.board.update({
    where: {
      id: boardId,
      schoolId,
    },
    data: {
      title,
      content,
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
