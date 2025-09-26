"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { passiveControlSchema } from "@/app/actions/passiveInsert/passiveControlSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type PassiveControlRequest = z.infer<typeof passiveControlSchema>;
export type PassiveControlResponse = Awaited<ReturnType<typeof passiveControl>>;

export async function passiveControl(request: PassiveControlRequest) {
  const validated = passiveControlSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { grade, schoolId, mode } = validated.data;

  const school = await mysqlPrisma.school.findUnique({
    where: { schoolId },
  });

  if (!school) {
    await mysqlPrisma.logs.create({
      data: {
        content: `해당 학교를 찾을 수 없습니다.`,
        schoolId,
        logsStatus: "No",
        grade: ``,
        count: null,
        reason: `Error`,
      },
    });
    return {
      code: "FAIL" as const,
      message: "해당 학교를 찾을 수 없습니다.",
    };
  }

  const formattedToday = dayjs().format("YY.MM.DD(ddd)");

  try {
    await mysqlPrisma.$transaction(async (trx) => {
      const isAllGrades = grade.includes("all") || grade.length === 0;

      // 학생 목록 조회
      const students = await trx.student.findMany({
        where: {
          schoolId,
          studentStatus: true,
          ...(isAllGrades ? {} : { studentGrade: { in: grade.map(Number) } }),
        },
        select: { studentId: true, studentGrade: true },
      });

      if (students.length === 0) return;

      if (mode === "insert") {
        // Brushed insert
        await trx.brushed.createMany({
          data: students.map((s) => ({
            studentId: s.studentId,
            brushedStatus: "No",
            brushedAt: new Date(),
            updatedAt: new Date(),
          })),
        });
      } else if (mode === "delete") {
        // Brushed delete
        await trx.brushed.deleteMany({
          where: { studentId: { in: students.map((s) => s.studentId) } },
        });
      }

      // 학년별 집계
      const gradeMap = new Map<number, number>();
      students.forEach((s) => {
        gradeMap.set(s.studentGrade, (gradeMap.get(s.studentGrade) || 0) + 1);
      });

      for (const [g, count] of gradeMap.entries()) {
        await trx.logs.create({
          data: {
            content: `${formattedToday} ${school.schoolName} ${g}학년 ${count}개의 rows가 ${
              mode === "insert" ? "생성" : "삭제"
            }되었습니다.`,
            schoolId,
            logsStatus: mode === "insert" ? "Ok" : "Del",
            grade: `${g}학년`,
            count,
            reason: null,
          },
        });
      }
    });

    revalidatePath("/logs");

    return {
      code: "SUCCESS" as const,
      message: `Brushed Data 및 Logs ${mode === "insert" ? "생성" : "삭제"}을 완료했습니다.`,
    };
  } catch (error) {
    console.error(error);
    await mysqlPrisma.logs.create({
      data: {
        content: `Brushed Data ${mode === "insert" ? "생성" : "삭제"} 중 에러가 발생했습니다.`,
        schoolId,
        logsStatus: "No",
        grade: ``,
        count: null,
        reason: `Error`,
      },
    });
    return {
      code: "FAIL" as const,
      message: `Brushed Data ${mode === "insert" ? "생성" : "삭제"} 중 에러가 발생했습니다.`,
    };
  }
}
