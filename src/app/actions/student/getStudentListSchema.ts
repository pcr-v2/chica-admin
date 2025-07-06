import { z } from "zod";

export const getStudentListSchema = z.object({
  schoolType: z.enum(["master", "teacher"], {
    required_error: "학교 타입이 없습니다.",
  }),
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
});
