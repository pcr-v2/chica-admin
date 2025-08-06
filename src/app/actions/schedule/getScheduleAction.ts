"use server";

import { z } from "zod";

import { getScheduleSchema } from "@/app/actions/schedule/scheduleSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type GetScheduleRequest = z.infer<typeof getScheduleSchema>;
export type GetScheduleResponse = Awaited<ReturnType<typeof getSchedule>>;

export async function getSchedule(request: GetScheduleRequest) {
  const validated = getScheduleSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { scheduleId } = validated.data;

  const result = await mysqlPrisma.schedules.findFirst({
    where: {
      id: scheduleId,
    },
  });

  if (!result) {
    return {
      code: "INVALID_CREDENTIAL" as const,
      message: "스케줄 정보를 가져오는중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "스케줄 정보를 가져왔습니다.",
    result,
  };
}
