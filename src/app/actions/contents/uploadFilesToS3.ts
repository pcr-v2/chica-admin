"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import { mysqlPrisma } from "@/libs/prisma";
import { s3 } from "@/libs/s3";

type TRequest = {
  formData: FormData;
  schoolId: string;
};

export async function uploadFilesToS3(request: TRequest) {
  const { formData, schoolId } = request;
  const files = formData.getAll("files") as File[];
  if (!files.length) return [];

  const uploadedMeta = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const userFileName = file.name.split(".")[0];

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: `${schoolId}/${fileName}`,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    const fileUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME!}.s3.${process.env.NEXT_PUBLIC_AWS_REGION!}.amazonaws.com/${schoolId}/${fileName}`;

    // 메타 정보 배열에 저장
    uploadedMeta.push({
      url: fileUrl,
      fileName,
      fileType: fileExt,
      fileSize: (file.size / (1024 * 1024)).toFixed(2), // 소수점 2자리
      userFileName: userFileName,
    });
  }

  try {
    // 1. 이미 업로드된 컨텐츠들의 fileSize 합 (MB)
    const existingTotalSizeMB = await mysqlPrisma.contents
      .aggregate({
        _sum: { fileSize: true },
        where: { schoolId },
      })
      .then((res) => res._sum.fileSize ?? 0);

    // 2. 이번 업로드될 파일들의 fileSize 합 (MB)
    const newTotalSizeMB = uploadedMeta.reduce(
      (sum, file) => sum + Number(file.fileSize), // fileSize는 이미 MB 단위로 저장
      0,
    );

    // 3. 업로드 가능 여부 확인
    if (existingTotalSizeMB + newTotalSizeMB > 1024) {
      return {
        code: "FAIL" as const,
        message: "업로드 용량(1GB)을 초과했습니다.",
      };
    }

    const maxSeqRecord = await mysqlPrisma.contents.findFirst({
      where: { schoolId },
      orderBy: { seq: "desc" },
      select: { seq: true },
    });

    await mysqlPrisma.contents.createMany({
      data: uploadedMeta.map(
        ({ fileName, fileType, fileSize, userFileName }, idx) => ({
          schoolId,
          fileName: fileName.split(".")[0], // UUID만
          seq: maxSeqRecord ? maxSeqRecord.seq + idx + 1 : idx + 1,
          fileType: fileType as string,
          contentsStatus: true,
          fileSize: Number(fileSize),
          userFileName,
        }),
      ),
      skipDuplicates: true,
    });

    return {
      code: "SUCCESS" as const,
      message: "파일 업로드 및 DB 저장 완료",
      files: uploadedMeta,
    };
  } catch (error) {
    console.log("DB 저장 오류", error);
    return {
      code: "FAIL" as const,
      message: "DB 저장 중 오류가 발생했습니다.",
    };
  }
}
