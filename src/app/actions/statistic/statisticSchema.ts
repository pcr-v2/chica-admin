import z from "zod";

export const getStatisticSchema = z.object({
  studentId: z.string({ required_error: "학생 아이디가 없습니다." }),
  type: z.enum(["week", "month", "term"], {
    required_error: "통계 타입이 없습니다.",
  }),
});

export const getRankPageStatisticSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
  type: z.enum(["month", "term"], {
    required_error: "통계 타입이 없습니다.",
  }),
});

export const getChartStatisticSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
  type: z.enum(["day", "week"], {
    required_error: "통계 타입이 없습니다.",
  }),
});
