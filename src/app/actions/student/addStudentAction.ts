"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { addStudentSchema } from "@/app/actions/student/studentSchema";
import { mysqlPrisma } from "@/libs/prisma";

export type AddStudentRequest = z.infer<typeof addStudentSchema>;

export async function addStudent(request: AddStudentRequest) {
  const validated = addStudentSchema.safeParse(request);

  if (!validated.success) {
    return {
      code: "VALIDATION_ERROR" as const,
      message: validated.error.issues[0].message,
    };
  }

  const { schoolId, students } = validated.data;

  if (schoolId == null) {
    return {
      code: "FAIL" as const,
      message: "학교 아이디가 존재하지 않습니다.",
    };
  }

  try {
    await mysqlPrisma.$transaction(async (trx) => {
      // 중복 확인
      const duplicates = await trx.student.findMany({
        where: {
          schoolId,
          OR: students.map((student) => ({
            studentGrade: student.studentGrade,
            studentClass: student.studentClass,
            studentNumber: student.studentNumber,
            studentStatus: true,
          })),
        },
        select: {
          studentGrade: true,
          studentClass: true,
          studentNumber: true,
        },
      });

      if (duplicates.length > 0) {
        const dupInfo = duplicates
          .map(
            (d) =>
              `${d.studentGrade}학년 ${d.studentClass}반 ${d.studentNumber}번`,
          )
          .join(", ");

        throw new Error(`이미 존재하는 학생: ${dupInfo}`);
      }

      await trx.student.createMany({
        data: students.map((student) => ({
          schoolId: schoolId,
          studentId: uuidv4(),
          studentName: student.studentName,
          studentGrade: student.studentGrade,
          studentClass: student.studentClass,
          studentGender: student.studentGender,
          studentNumber: student.studentNumber,
          studentStatus: student.studentStatus,
        })),
      });
    });

    revalidatePath("/student");

    return {
      code: "SUCCESS" as const,
      message: "학생이 등록되었습니다.",
    };
  } catch (error: any) {
    return {
      code: "STUDENT_REGIST_ERROR" as const,
      message: error.message || "학생 등록 중 오류가 발생했습니다.",
    };
  }
}
