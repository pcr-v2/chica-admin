"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { s3 } from "@/libs/s3";

// 기존에 생성한 s3 클라이언트 불러오기

type PresignRequest = {
  fileName: string; // 실제 업로드할 파일명
  fileType: string; // MIME 타입
  schoolId: string;
};

export async function getPresignedUploadUrl({
  fileName,
  fileType,
  schoolId,
}: PresignRequest) {
  const fileExt = fileName.split(".").pop();
  const key = `${schoolId}/${uuidv4()}.${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5분 유효
  });

  return {
    url: signedUrl,
    key,
  };
}
