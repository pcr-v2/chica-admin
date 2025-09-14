"use server";

import dayjs from "dayjs";
import { z } from "zod";

import { getLogsSchema } from "@/app/actions/logs/logsSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type GetLogsRequest = z.infer<typeof getLogsSchema>;
export type GetLogsResponse = Awaited<ReturnType<typeof getLogs>>;

export async function getLogs(request: GetLogsRequest) {
  const validated = getLogsSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolType, date } = validated.data;

  if (schoolType === "teacher") {
    return;
  }
  const startDate = date ? dayjs(date).startOf("day") : dayjs().startOf("day");
  const endDate = date ? dayjs(date).endOf("day") : dayjs().endOf("day");

  if (!startDate.isValid() || !endDate.isValid()) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: "날짜 형식이 올바르지 않습니다.",
    };
  }

  const res = await mysqlPrisma.logs.findMany({
    where: {
      createdAt: {
        gte: startDate.toDate(),
        lte: endDate.toDate(),
      },
    },
    select: {
      content: true,
      id: true,
      createdAt: true,
      logsStatus: true,
      schoolId: true,
      school: {
        select: {
          schoolName: true,
        },
      },
    },
  });

  if (res == null) {
    return {
      code: "FAIL" as const,
      message: "로그를 가져오는 중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "로그를 가져왔습니다.",
    result: res,
  };
}
