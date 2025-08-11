"use server";

import { z } from "zod";

import { updateSeqSchema } from "@/app/actions/contents/contentsSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type UpdateSeqRequest = z.infer<typeof updateSeqSchema>;
export type UpdateSeqResponse = Awaited<ReturnType<typeof updateSeq>>;

export async function updateSeq(request: UpdateSeqRequest) {
  const validated = updateSeqSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const updateRes = await mysqlPrisma.$transaction(
    validated.data.map(({ id, seq }) =>
      mysqlPrisma.contents.update({
        where: { id: Number(id) },
        data: { seq },
      }),
    ),
  );

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
