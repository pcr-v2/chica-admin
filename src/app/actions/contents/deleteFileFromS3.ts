"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

import { mysqlPrisma } from "@/libs/prisma";
import { s3 } from "@/libs/s3";

// import { prisma } from "@/libs/prisma"; // DB 삭제 필요 시 활성화

/**
 * S3에서 파일 삭제 (서버액션)
 * @param keys 삭제할 파일 Key 배열 (예: ["abc.jpeg", "folder/def.png"])
 */

type TRequest = {
  keys: string[];
  schoolId: string;
  fileType: string;
};

export async function deleteFileFromS3(request: TRequest) {
  const { keys, schoolId, fileType } = request;

  if (!keys || keys.length === 0) {
    throw new Error("삭제할 파일 key가 없습니다.");
  }

  for (const key of keys) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: `${schoolId}/${key}.${fileType}`,
      }),
    );

    // DB 연동 예시
    const res = await mysqlPrisma.contents.delete({
      where: { fileName: key },
    });

    // console.log("res", `${schoolId}/${key}.${fileType}`);

    if (res == null) {
      return {
        code: "FAIL" as const,
        message: "삭제에 실패했습니다. 관리자에게 문의 해주세요",
      };
    }
    return {
      code: "SUCCESS" as const,
      message: "파일 삭제를 완료했습니다.",
    };
  }

  // 페이지 새로고침/캐시 무효화
  revalidatePath("/contents");
}
