"use server";

import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { addSchoolSchema } from "@/app/actions/school/addSchoolSchema";
import { mysqlPrisma } from "@/libs/prisma";
import customDayjs from "@/utils/customDayjs";

export type GetSchoolListResponse = Awaited<ReturnType<typeof getSchoolList>>;

export async function getSchoolList() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("CHICA_ADMIN_ACCESS_TOKEN")?.value;

  if (accessToken == null) {
    return {
      code: "UNAUTHORIZED",
      message: "인증이 필요합니다.",
    };
  }

  const result = await mysqlPrisma.school.findMany({
    where: {
      school_status: { not: false },
      start_at: { lte: customDayjs().toISOString() },
      end_at: { gte: customDayjs().toISOString() },
    },
  });

  if (!result) {
    return {
      code: "INVALID_CREDENTIAL" as const,
      message: "학교 리스트를 가져오는중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "학교리스트를 가져왔습니다.",
    result,
  };
}
