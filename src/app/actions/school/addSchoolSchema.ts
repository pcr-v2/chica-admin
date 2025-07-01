import { z } from "zod";

export const addSchoolSchema = z.object({
  school_name: z.string({ required_error: "학교 이름을 입력해 주세요." }),
  login_id: z.string({ required_error: "아이디를 입력해 주세요." }),
  login_pw: z.string({ required_error: "비밀번호를 입력해 주세요." }),
  manager_name: z.string({ required_error: "매니저 이름을 입력해 주세요." }),
  manager_email: z.string({ required_error: "매니저 이메일을 입력해 주세요." }),
  manager_phone: z.string({
    required_error: "매니저 전화번호를 입력해 주세요.",
  }),
  end_at: z.string({ required_error: "종료일을 입력해 주세요." }),
  school_status: z.boolean({ required_error: "학교상태를 입력해 주세요." }),
  school_level: z.enum(["elementary", "middle", "high"], {
    required_error: "학교 레벨을 선택해주세요.",
  }),
});
