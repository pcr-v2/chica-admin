import { z } from "zod";

export const getContentsListSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
});

export const addContentsSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
  fileName: z.string({ required_error: "파일 이름이 없습니다." }),
  fileType: z.string({ required_error: "파일 타입이 없습니다." }),
  seq: z.number({ required_error: "정렬 값이 없습니다." }),
  contentsStatus: z.boolean({ required_error: "컨텐츠 상태가 없습니다." }),
});
