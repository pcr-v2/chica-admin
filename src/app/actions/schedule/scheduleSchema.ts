import { z } from "zod";

export const getScheduleListSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
});

export const addScheduleSchema = z.object({
  schoolId: z.string({ required_error: "학교 아이디가 없습니다." }),
  scheduleName: z.string({ required_error: "스케줄 이름이 없습니다." }),
  scheduleTarget: z.array(
    z.string({ required_error: "스케줄 대상 없습니다." }),
  ),
  startAt: z.string({ required_error: "스케줄 시작 날짜 없습니다." }),
  endAt: z.string({ required_error: "스케줄 종료 날짜 없습니다." }),
  scheduleStatus: z.boolean({ required_error: "스케줄 대상 없습니다." }),
  schoolLevel: z.enum(["elementary", "middle", "high"], {
    required_error: "학교 레벨을 선택해주세요.",
  }),
});

export const getScheduleSchema = z.object({
  scheduleId: z.number({ required_error: "스케줄 아이디가 없습니다." }),
});

export const deleteScheduleSchema = z.object({
  scheduleSetId: z.string({ required_error: "스케줄 Set 아이디가 없습니다." }),
});

export const updateScheduleSchema = z.object({
  scheduleSetId: z.string({ required_error: "스케줄 Set 아이디가 없습니다." }),
  dateDiff: z.number({ required_error: "수정일 차이값이 없습니다." }),
});
