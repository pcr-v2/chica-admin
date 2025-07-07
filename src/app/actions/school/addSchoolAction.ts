"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { addSchoolSchema } from "@/app/actions/school/addSchoolSchema";
import { mysqlPrisma } from "@/libs/prisma";
import customDayjs from "@/utils/customDayjs";

export type AddSchoolRequest = z.infer<typeof addSchoolSchema>;

export async function addSchool(request: AddSchoolRequest) {
  const validated = addSchoolSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const {
    schoolName,
    loginId,
    loginPw,
    teacherName,
    teacherEmail,
    teacherPhone,
    endAt,
    schoolStatus,
  } = validated.data;

  const hashedPw = await bcrypt.hash(loginPw, 12);

  const res = await mysqlPrisma.school.create({
    data: {
      // schoolId: uuidv4(),
      schoolName,
      loginId,
      loginPw: hashedPw,
      teacherEmail,
      teacherName,
      teacherPhone,
      endAt: customDayjs(endAt).toISOString(),
      startAt: new Date(),
      schoolStatus,
    },
  });

  revalidatePath("/school/list");

  if (!res) {
    return {
      code: "INVALID_CREDENTIAL" as const,
      message: "학교 생성중 문제가 발생했습니다.",
    };
  }

  return {
    code: "SUCCESS" as const,
    message: "학교생성이 완료되었습니다.",
  };
}
