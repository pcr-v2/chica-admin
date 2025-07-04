"use client";

import {
  Box,
  Button,
  FormControlLabel,
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

interface IProps {
  onSuccess: () => void;
}

export default function SchoolAddForm(props: IProps) {
  const { onSuccess } = props;

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
    console.log(school);

    const res = await addSchool(school);

    if (res.code === "SUCCESS") {
      toast.success(res.message);
      onSuccess();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Wrapper>
      <FormCard>
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

        <InputWrap>
          <Label>종료일</Label>
          <FormDatePicker
            value={school.end_at}
            onChange={(e) => {
              setSchool({ ...school, end_at: e.target.value as string });
            }}
          />
        </InputWrap>

        <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Label>학교 상태</Label>
            <Toggle
              label={""}
              checked={school.school_status}
              onChange={(e) => {
                setSchool({ ...school, school_status: e });
              }}
            />
          </Box>
          <Box>
            <Label>학교 레벨</Label>
            <RadioWrap
              defaultValue="elementary"
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
              <Box sx={{ display: "flex" }}>
                초
                <Radio value="elementary" />
                중
                <Radio value="middle" />
                고
                <Radio value="high" />
              </Box>
            </RadioWrap>
          </Box>
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
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const FormCard = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    padding: "24px",
    borderRadius: "12px",
    flexDirection: "column",
  };
});

const InputWrap = styled(Box)(() => {
  return {
    gap: "4px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const Label = styled("span")(() => {
  return {
    fontSize: 12,
    color: "#616161",
    lineHeight: "140%",
    letterSpacing: "-0.12px",
  };
});

const RadioWrap = styled(RadioGroup)(() => {
  return {
    "& .MuiRadio-root": {
      margin: 0,
      padding: 0,
    },
  };
});
