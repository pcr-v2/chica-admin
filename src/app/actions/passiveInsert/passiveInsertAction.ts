"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { passiveInsertSchema } from "@/app/actions/passiveInsert/passiveInsertSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type PassiveInsertRequest = z.infer<typeof passiveInsertSchema>;
export type PassiveInsertResponse = Awaited<ReturnType<typeof passiveInsert>>;

export async function passiveInsert(request: PassiveInsertRequest) {
  const validated = passiveInsertSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { grade, schoolId } = validated.data;

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
      // case1: 특정 학년 선택
      if (grade.includes("all") === false) {
        for (const g of grade.map(Number)) {
          const gradeStudents = await trx.student.findMany({
            where: { studentGrade: g, schoolId, studentStatus: true },
            select: { studentId: true },
          });

          // Brushed insert
          await trx.brushed.createMany({
            data: gradeStudents.map((s) => ({
              studentId: s.studentId,
              brushedStatus: "No",
              brushedAt: new Date(),
              updatedAt: new Date(),
            })),
          });

          // Logs insert
          await trx.logs.create({
            data: {
              content: `${formattedToday} ${school.schoolName} ${g}학년 ${gradeStudents.length}개의 rows가 생성되었습니다.`,
              schoolId,
              logsStatus: "Ok",
              grade: `${g}학년`,
              count: gradeStudents.length,
              reason: null,
            },
          });
        }
      } else {
        // case2: 전체(all)
        const allStudents = await trx.student.findMany({
          where: { schoolId, studentStatus: true },
          select: { studentId: true, studentGrade: true },
        });

        // Brushed insert
        await trx.brushed.createMany({
          data: allStudents.map((s) => ({
            studentId: s.studentId,
            brushedStatus: "No",
            brushedAt: new Date(),
            updatedAt: new Date(),
          })),
        });

        // 학년별 집계
        const gradeMap = new Map<number, number>();
        allStudents.forEach((s) => {
          gradeMap.set(s.studentGrade, (gradeMap.get(s.studentGrade) || 0) + 1);
        });

        for (const [g, count] of gradeMap.entries()) {
          await trx.logs.create({
            data: {
              content: `${formattedToday} ${school.schoolName} ${g}학년 ${count}개의 rows가 생성되었습니다.`,
              schoolId,
              logsStatus: "Ok",
              grade: `${g}학년`,
              count,
              reason: null,
            },
          });
        }
      }
    });

    revalidatePath("/logs");

    return {
      code: "SUCCESS" as const,
      message: "Brushed Data 및 Logs 생성을 완료했습니다.",
    };
  } catch (error) {
    console.error(error);
    await mysqlPrisma.logs.create({
      data: {
        content: `Brushed Data 생성 중 에러가 발생했습니다.`,
        schoolId,
        logsStatus: "No",
        grade: ``,
        count: null,
        reason: `Error`,
      },
    });
    return {
      code: "FAIL" as const,
      message: "Brushed Data 생성 중 에러가 발생했습니다.",
    };
  }
}
