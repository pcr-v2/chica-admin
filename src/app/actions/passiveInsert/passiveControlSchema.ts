import { z } from "zod";

export const passiveControlSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
  grade: z.array(z.string({ required_error: "학년이 존재하지 않습니다." })),
  mode: z.enum(["insert", "delete"]),
});
