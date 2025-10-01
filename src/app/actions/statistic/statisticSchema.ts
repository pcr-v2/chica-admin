import z from "zod";

export const getStatisticSchema = z.object({
  studentId: z.string({ required_error: "학생 아이디가 없습니다." }),
  type: z.enum(["week", "month", "term"], {
    required_error: "통계 타입이 없습니다.",
  }),
});

export const getUnCheckedStatisticSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
});

export const getPersonalRankStatisticSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
  isTotal: z.boolean(),
  searchRange: z.object({
    startAt: z.string().optional(),
    endAt: z.string().optional(),
  }),
});

export const getChartStatisticSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
  type: z.enum(["day", "week"], {
    required_error: "통계 타입이 없습니다.",
  }),
});
