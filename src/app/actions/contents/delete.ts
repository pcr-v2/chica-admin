"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

import { s3 } from "@/libs/s3";

// import { prisma } from "@/libs/prisma"; // DB 삭제 필요 시 활성화

/**
 * S3에서 파일 삭제 (서버액션)
 * @param keys 삭제할 파일 Key 배열 (예: ["abc.jpeg", "folder/def.png"])
 */
export async function deleteContents(keys: string[]) {
  if (!keys || keys.length === 0) {
    throw new Error("삭제할 파일 key가 없습니다.");
  }

  for (const key of keys) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: "6a93cd6f-5b78-4d62-b17c-0efbcbe4a84f.jpeg",
      }),
    );

    // DB 연동 예시
    // await prisma.content.delete({
    //   where: { fileKey: key },
    // });
  }

  // 페이지 새로고침/캐시 무효화
  revalidatePath("/contents");
}
