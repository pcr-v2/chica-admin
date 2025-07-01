import { z } from "zod";

export const csvStudentsBlukRegistSchema = z.array(
  z.object({
    student_name: z.string(),
    student_grade: z.string(),
    student_class: z.string(),
    student_number: z.string(),
    student_gender: z.string(),
    student_status: z.enum(["Y", "N", "y", "n", ""]),
  }),
);
