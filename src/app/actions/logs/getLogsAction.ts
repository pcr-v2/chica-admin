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

  const { schoolType } = validated.data;

  if (schoolType === "teacher") {
    return;
  }

  //   console.log(schoolType);
  const start = dayjs().startOf("day").toDate(); // 2025-09-14 00:00:00
  const end = dayjs().endOf("day").toDate(); // 2025-09-14 23:59:59

  const res = await mysqlPrisma.logs.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  console.log("res", res);

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
