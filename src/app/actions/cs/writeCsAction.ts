"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { z } from "zod";

import { writeCsSchema } from "@/app/actions/cs/csSchema";
import { mysqlPrisma } from "@/libs/prisma";

dayjs.extend(utc);

export type WriteCsRequest = z.infer<typeof writeCsSchema>;

export async function writeCs(request: WriteCsRequest) {
  const validated = writeCsSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, content, title } = validated.data;

  if (schoolId == null) {
    return {
      code: "FAIL" as const,
      message: "학교 아이디가 존재하지 않습니다.",
    };
  }

  const getSchoolInfo = await mysqlPrisma.school.findFirst({
    where: {
      schoolId,
    },
  });

  const writeResult = await mysqlPrisma.board.create({
    data: {
      schoolId,
      title,
      content,
    },
  });

  if (writeResult == null) {
    return {
      code: "FAIL" as const,
      message: "작성중에 문제가 발생했습니다.",
    };
  }

  // ── 여기서 메일 발송 ──
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_MAILER_HOST,
      port: Number(process.env.NEXT_PUBLIC_MAILER_PORT),
      secure: Number(process.env.NEXT_PUBLIC_MAILER_PORT) === 465,
      auth: {
        user: process.env.NEXT_PUBLIC_MAILER_USER,
        pass: process.env.NEXT_PUBLIC_MAILER_KEY,
      },
    });

    const createdTime = dayjs()
      .utc()
      .add(9, "hour")
      .format("YYYY-MM-DD HH:mm:ss");

    await transporter.sendMail({
      from: `"양치킹 어드민 알림봇" <${process.env.NEXT_PUBLIC_MAILER_USER}>`,
      to: process.env.NEXT_PUBLIC_MAILER_ADMIN,
      subject: `[양치킹-CS] ${getSchoolInfo?.schoolName} 새 문의: ${title}`,
      html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color:#13BA81; margin-bottom:16px;">문의제목 : ${title}</h2>
              <p style="font-size:20px; margin-bottom:12px; word-break: keep-all; color:#212121;">내용 : ${content}</p>
              <span style="font-size:14px; color:#424242;">
                문의시간 : ${createdTime}
              </span>
            </div>
          `,
    });
  } catch (err) {
    console.error("메일 발송 실패:", err);
    // 실패해도 글 작성은 유지
  }

  revalidatePath("/cs");

  return {
    code: "SUCCESS" as const,
    message: "작성이 완료되었습니다.",
  };
}
