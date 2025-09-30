"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { mysqlPrisma } from "@/libs/prisma";

const secretKey = new TextEncoder().encode(process.env.TOKEN_SECRET);

export type GetMeResponse = Awaited<ReturnType<typeof getMe>>;

export async function getMe() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("CHICA_ADMIN_ACCESS_TOKEN")?.value;

  if (accessToken == null) {
    return {
      code: "UNAUTHORIZED" as const,
      message: "인증이 필요합니다.",
    };
  }

  try {
    const verified = await jwtVerify(accessToken, secretKey);

    const admin = await mysqlPrisma.school.findFirst({
      where: {
        loginId: verified.payload.id!,
      },
    });

    if (admin == null) {
      return {
        code: "NOT_FOUND" as const,
        message: "존재하지 않는 유저입니다.",
      };
    }

    let countUnAnswerCount = 0;
    if (admin.schoolType === "master") {
      const res = await mysqlPrisma.board.count({
        where: {
          status: "UNANSWERED",
        },
      });

      countUnAnswerCount = res;
    }

    return {
      code: "SUCCESS" as const,
      data: {
        type: admin.schoolType,
        loginId: admin.loginId,
        schoolId: admin.schoolId,
        schoolLevel: admin.schoolLevel,
        name: admin.teacherName,
        schoolName: admin.schoolName,
        phone: admin.teacherPhone,
        email: admin.teacherEmail,
        startAt: admin.startAt,
        endAt: admin.endAt,
        countUnAnswerCount: countUnAnswerCount,
      },
    };
  } catch (error) {
    return {
      code: "FAIL" as const,
      message: "유저 정보를 가져오는데 실패했습니다.",
    };
  }
}
