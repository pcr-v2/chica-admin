import { z } from "zod";

export const getLogsSchema = z.object({
  schoolType: z.enum(["master", "teacher"], {
    required_error: "학교 타입이 없습니다",
  }),
  date: z.string().optional(),
});
