"use server";

import { mysqlPrisma } from "@/libs/prisma";

type MetaFile = {
  fileName: string;
  fileType: string | undefined;
  fileSize: number;
  userFileName: string | undefined;
};

type SaveMetaRequest = {
  schoolId: string;
  files: MetaFile[];
};

export async function saveMetaToDB(request: SaveMetaRequest) {
  const { schoolId, files } = request;

  try {
    const maxSeqRecord = await mysqlPrisma.contents.findFirst({
      where: { schoolId },
      orderBy: { seq: "desc" },
      select: { seq: true },
    });

    // console.log("files", files);

    await mysqlPrisma.contents.createMany({
      data: files.map(
        ({ fileName, fileType, fileSize, userFileName }, idx) => ({
          schoolId,
          fileName,
          seq: maxSeqRecord ? maxSeqRecord.seq + idx + 1 : idx + 1,
          fileType: fileType as string,
          contentsStatus: true,
          fileSize,
          userFileName,
        }),
      ),
      skipDuplicates: true,
    });

    return { code: "SUCCESS", message: "DB 저장 완료" };
  } catch (error) {
    console.log("DB 저장 오류", error);
    return { code: "FAIL", message: "DB 저장 오류 발생" };
  }
}
