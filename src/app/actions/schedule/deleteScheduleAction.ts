"use server";

import { z } from "zod";

import { deleteScheduleSchema } from "@/app/actions/schedule/scheduleSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type DeleteScheduleRequest = z.infer<typeof deleteScheduleSchema>;
export type DeleteScheduleResponse = Awaited<ReturnType<typeof deleteSchedule>>;

export async function deleteSchedule(request: DeleteScheduleRequest) {
  const validated = deleteScheduleSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { scheduleSetId } = validated.data;

  // const findAnniversary = await mysqlPrisma.schedules.findFirst({
  //   where: {
  //     scheduleSetId,
  //     scheduleStatus: true,
  //   },
  // });

  // //개교기념일 삭제가 가능한가? 아님 그냥 추가등록
  // if (findAnniversary?.scheduleName === "개교기념일") {
  //   return {
  //     code: "FAIL" as const,
  //     message: "개교기념일은 삭제할 수 없습니다.",
  //   };
  // }

  const result = await mysqlPrisma.schedules.updateMany({
    where: {
      scheduleSetId,
    },
    data: {
      scheduleStatus: false,
    },
  });

  if (!result) {
    return {
      code: "FAIL" as const,
      message: "스케줄 삭제하는 중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "스케줄 삭제를 완료했습니다.",
    result,
  };
}
