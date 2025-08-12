"use server";

import { z } from "zod";

import { addContentsSchema } from "@/app/actions/contents/contentsSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type AddContentsRequest = z.infer<typeof addContentsSchema>;

export async function addContents(request: AddContentsRequest) {
  const validated = addContentsSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, fileName, fileType, seq, contentsStatus } = validated.data;

  if (schoolId == null) {
    return {
      code: "FAIL" as const,
      message: "학교 아이디가 존재하지 않습니다.",
    };
  }
  // 현재 schoolId의 가장 큰 seq 찾기
  const latestSeq = await mysqlPrisma.contents.findFirst({
    where: { schoolId },
    select: { seq: true },
    orderBy: { seq: "desc" },
  });

  const newSeq = latestSeq?.seq ? latestSeq.seq + 1 : 1;

  const addResult = await mysqlPrisma.contents.create({
    data: {
      schoolId,
      fileName,
      fileType,
      seq: newSeq,
      contentsStatus,
    },
  });

  // console.log("addResult", addResult);

  return {
    code: "SUCCESS" as const,
    message: "파일이 등록되었습니다.",
  };
}
