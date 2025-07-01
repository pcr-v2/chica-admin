import { z } from "zod";

export const getSchoolSchema = z.object({
  school_id: z.string({ required_error: "학교 아이디가 없습니다." }),
});
