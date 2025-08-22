"use server";

import dayjs from "dayjs";
import { z } from "zod";

import { updateScheduleSchema } from "@/app/actions/schedule/scheduleSchema";
// 날짜 계산을 위해 사용
import { mysqlPrisma } from "@/libs/prisma";

export type UpdateScheduleRequest = z.infer<typeof updateScheduleSchema>;
export type UpdateScheduleResponse = Awaited<ReturnType<typeof updateSchedule>>;

export async function updateSchedule(request: UpdateScheduleRequest) {
  const validated = updateScheduleSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { scheduleSetId, dateDiff } = validated.data;

  try {
    // 1. 해당 scheduleSetId의 스케줄 모두 조회
    const schedules = await mysqlPrisma.schedules.findMany({
      where: { scheduleSetId },
    });

    if (schedules.length === 0) {
      return {
        code: "NOT_FOUND" as const,
        message:
          "해당 일정 세트를 찾을 수 없습니다.(관리자에게 문의 해주세요.)",
      };
    }

    // 2. 각 스케줄 날짜를 dateDiff만큼 이동
    const updatePromises = schedules.map((schedule) => {
      const newScheduleAt = dayjs(schedule.scheduleAt)
        .add(dateDiff, "day")
        .toDate(); // Prisma는 Date 타입 필요

      return mysqlPrisma.schedules.update({
        where: { id: schedule.id }, // PK 기준 업데이트
        data: { scheduleAt: newScheduleAt },
      });
    });

    await Promise.all(updatePromises);
    console.log(
      `총 ${schedules.length}개의 스케줄이 ${dateDiff}일 만큼 이동되었습니다.`,
    );

    return {
      code: "SUCCESS" as const,
      message: "일정이 수정 되었습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      code: "FAIL" as const,
      message: "일정을 수정하는 중 문제가 발생했습니다.",
    };
  }
}
