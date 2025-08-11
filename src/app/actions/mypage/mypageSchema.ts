import { z } from "zod";

export const updateInfoSchema = z.object({
  schoolId: z.string({ required_error: "학교 id가 없습니다." }),
  teacherName: z.string({ required_error: "매니저 이름을 입력해 주세요." }),
  teacherEmail: z.string({ required_error: "매니저 이메일을 입력해 주세요." }),
  teacherPhone: z.string({
    required_error: "매니저 전화번호를 입력해 주세요.",
  }),
});
