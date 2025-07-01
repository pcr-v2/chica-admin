"use client";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  styled,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

import FormDatePicker from "@/app/_components/common/FormDatePicker";
import Input from "@/app/_components/common/Input";
import { Toggle } from "@/app/_components/common/Toggle";
import { addSchool } from "@/app/actions/school/addSchoolAction";

type TSchool = {
  school_name: string;
  login_id: string;
  login_pw: string;
  manager_name: string;
  manager_phone: string;
  manager_email: string;
  end_at: string;
  school_status: boolean;
  school_level: "elementary" | "middle" | "high";
};

export default function SchoolAddForm() {
  const [school, setSchool] = useState<TSchool>({
    school_name: "",
    login_id: "",
    login_pw: "",
    manager_name: "",
    manager_email: "",
    manager_phone: "",
    end_at: "",
    school_status: true,
    school_level: "elementary",
  });

  const handleAdd = async () => {
    const res = await addSchool(school);

    if (res.code === "SUCCESS") {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Wrapper>
      <FormCard>
        <Box sx={{ display: "flex", gap: "40px" }}>
          <InputWrap>
            <Label>학교 이름</Label>
            <Input
              value={school.school_name}
              onChange={(e) => {
                setSchool({ ...school, school_name: e.target.value });
              }}
              type="text"
            />
          </InputWrap>
          <InputWrap>
            <Label>아이디</Label>
            <Input
              value={school.login_id}
              onChange={(e) => {
                setSchool({ ...school, login_id: e.target.value });
              }}
              type="text"
            />
          </InputWrap>
          <InputWrap>
            <Label>비밀번호</Label>
            <Input
              value={school.login_pw}
              onChange={(e) => {
                setSchool({ ...school, login_pw: e.target.value });
              }}
              type="text"
            />
          </InputWrap>
        </Box>
        <Box sx={{ display: "flex", gap: "40px" }}>
          <InputWrap>
            <Label>매니저 이름</Label>
            <Input
              value={school.manager_name}
              onChange={(e) => {
                setSchool({ ...school, manager_name: e.target.value });
              }}
              type="text"
            />
          </InputWrap>
          <InputWrap>
            <Label>매니저 이메일</Label>
            <Input
              value={school.manager_email}
              onChange={(e) => {
                setSchool({ ...school, manager_email: e.target.value });
              }}
              type="text"
            />
          </InputWrap>
          <InputWrap>
            <Label>매니저 전화번호</Label>
            <Input
              value={school.manager_phone}
              onChange={(e) => {
                setSchool({ ...school, manager_phone: e.target.value });
              }}
              type="text"
            />
          </InputWrap>
        </Box>

        <Box sx={{ display: "flex", gap: "40px" }}>
          <InputWrap>
            <Label>종료일</Label>
            {/* <Input value={schoolId} onChange={() => {}} type="text" /> */}
            <FormDatePicker
              value={school.end_at}
              onChange={(e) => {
                setSchool({ ...school, end_at: e.target.value as string });
              }}
            />
          </InputWrap>
          <InputWrap>
            <Label>학교 상태</Label>
            <Toggle
              label={school.school_status.toString()}
              checked={school.school_status}
              onChange={(e) => {
                setSchool({ ...school, school_status: e });
              }}
            />
          </InputWrap>
          <InputWrap>
            <Label>학교 레벨</Label>
            <FormControl>
              <RadioGroup
                // aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="elementary"
                // name="radio-buttons-group"
                value={school.school_level}
                onChange={(e) =>
                  setSchool({
                    ...school,
                    school_level: e.target.value as
                      | "elementary"
                      | "middle"
                      | "high",
                  })
                }
              >
                <FormControlLabel
                  value="elementary"
                  control={<Radio />}
                  label="초등학교"
                />
                <FormControlLabel
                  value="middle"
                  control={<Radio />}
                  label="중학교"
                />
                <FormControlLabel
                  value="high"
                  control={<Radio />}
                  label="고등학교"
                />
              </RadioGroup>
            </FormControl>
          </InputWrap>
        </Box>
      </FormCard>

      <Button
        variant="contained"
        sx={{ width: "100%", borderRadius: "8px" }}
        onClick={handleAdd}
      >
        등록
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    // minHeight: "100dvh",
  };
});

const FormCard = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    // maxWidth: "720px",
    padding: "24px",
    rowGap: "32px",
    columnGap: "40px",
    borderRadius: "12px",
    backgroundColor: "#fafafa",
    // gridTemplateColumns: "1fr 1fr 1fr",
  };
});

const InputWrap = styled(Box)(() => {
  return {
    gap: "8px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const Label = styled("span")(() => {
  return {
    fontSize: 14,
    color: "#616161",
    lineHeight: "140%",
    letterSpacing: "-0.12px",
  };
});
