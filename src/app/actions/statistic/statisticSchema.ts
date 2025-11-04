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

export const getTotalStatisticSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
  gender: z
    .enum(["male", "female", "both", "total"], {
      required_error: "성별이 없습니다.",
    })
    .default("total"),
  searchDateType: z
    .enum(["daily", "weekly", "monthly"], {
      required_error: "일자 타입이 없습니다.",
    })
    .default("monthly"),
  searchRange: z.object({
    startAt: z.string().optional(),
    endAt: z.string().optional(),
  }),
  targetGrade: z
    .string({ required_error: "대상 학년이 없습니다." })
    .default("total"),
});
