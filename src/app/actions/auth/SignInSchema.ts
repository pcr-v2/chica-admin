import { z } from "zod";

export const signInSchema = z.object({
  id: z.string({ required_error: "아이디를 입력해 주세요." }),
  pw: z.string({ required_error: "비밀번호를 입력해 주세요." }),
});

export const convertGrankSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다" }),
  schoolType: z.enum(["master", "teacher"], {
    required_error: "학교 타입이 없습니다",
  }),
  id: z.string({ required_error: "아이디를 입력해 주세요." }),
  pw: z.string({ required_error: "비밀번호를 입력해 주세요." }),
});
