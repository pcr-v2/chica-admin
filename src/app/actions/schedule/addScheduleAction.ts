"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { addScheduleSchema } from "@/app/actions/schedule/scheduleSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type AddScheduleRequest = z.infer<typeof addScheduleSchema>;

export async function addSchedule(request: AddScheduleRequest) {
  const validated = addScheduleSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const {
    schoolId,
    scheduleName,
    scheduleTarget,
    startAt,
    endAt,
    scheduleStatus,
    schoolLevel,
  } = validated.data;

  if (schoolId == null) {
    return {
      code: "FAIL" as const,
      message: "학교 아이디가 존재하지 않습니다.",
    };
  }

  const start = dayjs(startAt).startOf("day");
  const end = dayjs(endAt).startOf("day");
  const diff = end.diff(start, "day");

  const scheduleAt = Array.from({ length: diff + 1 }, (_, i) =>
    start.add(i, "day").toDate(),
  );

  const data: {
    schoolId: string;
    scheduleName: string;
    scheduleSetId: string;

    scheduleTarget: string;
    scheduleStatus: boolean;
    scheduleAt: Date;
  }[] = [];

  // case 1: 초등 전체 선택
  if (scheduleTarget.length === 6 && schoolLevel === "elementary") {
    const scheduleSetId = uuidv4();

    scheduleAt.forEach((date) => {
      data.push({
        schoolId,
        scheduleName,
        scheduleSetId,
        scheduleTarget: "all",
        scheduleStatus,
        scheduleAt: new Date(dayjs(date).format("YYYY-MM-DD")),
      });
    });
  }
  // case 2: 중고등 전체 선택
  else if (
    (schoolLevel === "middle" && scheduleTarget.length === 3) ||
    (schoolLevel === "high" && scheduleTarget.length === 3)
  ) {
    const scheduleSetId = uuidv4();

    scheduleAt.forEach((date) => {
      data.push({
        schoolId,
        scheduleName,
        scheduleSetId,
        scheduleTarget: "all",
        scheduleStatus,
        scheduleAt: new Date(dayjs(date).format("YYYY-MM-DD")),
      });
    });
  }
  // case 3: 일부 학년 선택
  else {
    scheduleTarget.forEach((grade) => {
      const scheduleSetId = uuidv4();
      scheduleAt.forEach((date) => {
        data.push({
          schoolId,
          scheduleName,
          scheduleSetId,
          scheduleTarget: grade,
          scheduleStatus,
          scheduleAt: new Date(dayjs(date).format("YYYY-MM-DD")),
        });
      });
    });
  }

  const res = await mysqlPrisma.schedules.createMany({
    data,
  });

  // console.log("data", data);

  if (res == null) {
    return {
      code: "FAIL" as const,
      message: "일정 생성 중 오류가 발생했습니다.",
    };
  }

  revalidatePath("/schedule");

  return {
    code: "SUCCESS" as const,
    message: "일정이 등록되었습니다.",
  };
}
