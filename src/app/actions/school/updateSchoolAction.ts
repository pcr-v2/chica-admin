"use server";

import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { z } from "zod";

import { updateSchoolSchema } from "@/app/actions/school/schoolSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type UpdateSchoolRequest = z.infer<typeof updateSchoolSchema>;
export type UpdateSchoolResponse = Awaited<ReturnType<typeof updateSchool>>;

export async function updateSchool(request: UpdateSchoolRequest) {
  const validated = updateSchoolSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const {
    schoolId,
    schoolName,
    loginId,
    loginPw,
    teacherName,
    teacherEmail,
    teacherPhone,
    schoolLevel,
    schoolCode,
    officeCode,
    address,
    endAt,
    schoolAnniversary,
    schoolStatus,
  } = validated.data;

  const hashedPw = await bcrypt.hash(loginPw, 12);

  const updateRes = await mysqlPrisma.school.update({
    where: {
      schoolId,
    },
    data: {
      schoolId,
      schoolName,
      loginId,
      loginPw: hashedPw,
      teacherEmail,
      teacherName,
      teacherPhone: teacherPhone.replaceAll("-", ""),
      schoolCode,
      officeCode,
      address,
      schoolLevel,
      endAt: new Date(dayjs(endAt).format("YYYY-MM-DD")),
      startAt: new Date(),
      schoolStatus,
    },
  });

  if (updateRes == null) {
    return {
      code: "FAIL" as const,
      message: "수정 중 문제가 발생했습니다.",
    };
  }

  // const addedSchedule = await mysqlPrisma.schedules.create({
  //   data: {
  //     schoolId: updateRes.schoolId,
  //     scheduleName: "개교기념일",
  //     scheduleStatus: true,
  //     scheduleTarget: "all",
  //     scheduleAt: dayjs(schoolAnniversary).toDate(),
  //   },
  // });

  // if (!addedSchedule) {
  //   return {
  //     code: "FAIL" as const,
  //     message: "수정 중 문제가 발생했습니다.",
  //   };
  // }

  return {
    code: "SUCCESS" as const,
    message: "수정이 완료되었습니다.",
    result: updateRes,
  };
}
