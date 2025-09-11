"use server";

import { SignJWT } from "jose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import z from "zod";

import { convertGrankSchema } from "@/app/actions/auth/SignInSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type ConvertGrankRequest = z.infer<typeof convertGrankSchema>;

const secretKey = new TextEncoder().encode(process.env.TOKEN_SECRET);

export async function convertGrant(request: ConvertGrankRequest) {
  const validated = convertGrankSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, id: loginId, schoolType } = validated.data;

  // DB에서 권한 업데이트
  const res = await mysqlPrisma.school.update({
    where: {
      schoolId,
      loginId,
    },
    data: { schoolType },
  });

  if (!res) {
    return {
      code: "FAIL" as const,
      message: "관리자 권한 변경중 에러가 발생했습니다.",
    };
  }

  // ✅ 권한 변경 후 새 JWT 발급
  const newAccessToken = await new SignJWT({ id: loginId, type: schoolType })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secretKey);

  const newRefreshToken = await new SignJWT({ id: loginId, type: schoolType })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);

  // 쿠키에 새 토큰 저장
  const nextCookies = await cookies();
  nextCookies.set("CHICA_ADMIN_ACCESS_TOKEN", newAccessToken, {
    path: "/",
    httpOnly: true,
  });
  nextCookies.set("CHICA_ADMIN_REFRESH_TOKEN", newRefreshToken, {
    path: "/",
    httpOnly: true,
  });

  revalidatePath("/dashboard");

  return {
    code: "SUCCESS" as const,
    message: "권한을 변경하고 토큰을 갱신했습니다.",
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
