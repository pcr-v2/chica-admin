"use server";

import bcrypt from "bcryptjs";
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
    school_name,
    login_id,
    login_pw,
    manager_name,
    manager_email,
    manager_phone,
    end_at,
    school_status,
  } = validated.data;

  const hashedPw = await bcrypt.hash(login_pw, 12);

  const res = await mysqlPrisma.school.create({
    data: {
      school_id: uuidv4(),
      school_name,
      login_id,
      login_pw: hashedPw,
      manager_email,
      manager_name,
      manager_phone,
      end_at: customDayjs(end_at).toISOString(),
      start_at: new Date(),
      school_status,
    },
  });

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
