import { z } from "zod";

export const csvStudentsBlukRegistSchema = z.array(
  z.object({
    studentName: z.string(),
    studentGrade: z.string(),
    studentClass: z.string(),
    studentNumber: z.string(),
    studentGender: z.string(),
    studentStatus: z.enum(["Y", "N", "y", "n", ""]),
  }),
);

export const addStudentSchema = z.object({
  schoolId: z.string(),
  students: z.array(
    z.object({
      studentName: z.string(),
      studentGrade: z.number(),
      studentClass: z.string(),
      studentNumber: z.number(),
      studentGender: z.enum(["male", "female"]),
      studentStatus: z.boolean(),
    }),
  ),
});
