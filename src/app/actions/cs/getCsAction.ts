"use server";

import { z } from "zod";

import { getCsSchema } from "@/app/actions/cs/csSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type GetCsRequest = z.infer<typeof getCsSchema>;
export type GetCsResponse = Awaited<ReturnType<typeof getCs>>;

export async function getCs(request: GetCsRequest) {
  const validated = getCsSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { boardId } = validated.data;

  const res = await mysqlPrisma.board.findFirst({
    where: {
      id: boardId,
    },
  });

  if (res == null) {
    return {
      code: "FAIL" as const,
      message: "게시글을 가져오는 중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "게시글을 가져왔습니다.",
    result: res,
  };
}
