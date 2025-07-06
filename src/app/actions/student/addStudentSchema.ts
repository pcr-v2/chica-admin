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
