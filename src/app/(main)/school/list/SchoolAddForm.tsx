"use client";

import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

import SchoolAutoComplete from "@/app/_components/common/AutoComplete";
import FormDatePicker from "@/app/_components/common/FormDatePicker";
import Input from "@/app/_components/common/Input";
import SearchAutocomplete from "@/app/_components/common/SearchAutoComplete";
import { Toggle } from "@/app/_components/common/Toggle";
import { addSchool } from "@/app/actions/school/addSchoolAction";
import {
  getSchoolCode,
  SchoolCodeOption,
} from "@/app/actions/school/getSchoolCode";
import {
  formatPhoneNumber,
  isValidEmail,
  isValidLoginId,
  isValidPassword,
  isValidTeacherName,
} from "@/utils/regExp";

// type SchoolOption = {
//   name: string;
//   code: string;
//   officeCode: string;
//   address: string;
//   eduOfficeName: string;
// };

type TSchool = {
  schoolName: string;
  schoolCode: string;
  officeCode: string;
  address: string;
  loginId: string;
  loginPw: string;
  teacherName: string;
  teacherPhone: string;
  teacherEmail: string;
  endAt: string;
  schoolStatus: boolean;
  schoolAnniversary: string;
  schoolLevel: "elementary" | "middle" | "high";
};

interface IProps {
  onSuccess: () => void;
}

export default function SchoolAddForm(props: IProps) {
  const { onSuccess } = props;

  const [school, setSchool] = useState<TSchool>({
    schoolName: "",
    loginId: "",
    loginPw: "",
    schoolCode: "",
    officeCode: "",
    teacherName: "",
    teacherEmail: "",
    teacherPhone: "",
    address: "",
    endAt: "",
    schoolAnniversary: "",
    schoolStatus: true,
    schoolLevel: "elementary",
  });

  const handleAdd = async () => {
    const requiredFields: { key: keyof TSchool; label: string }[] = [
      { key: "schoolName", label: "학교 이름" },
      // { key: "schoolCode", label: "학교 코드" },
      // { key: "officeCode", label: "교육청 코드" },
      { key: "loginId", label: "아이디" },
      { key: "loginPw", label: "비밀번호" },
      { key: "teacherName", label: "매니저 이름" },
      { key: "teacherEmail", label: "매니저 이메일" },
      { key: "teacherPhone", label: "매니저 전화번호" },
      // { key: "address", label: "주소" },
      { key: "endAt", label: "종료일" },
    ];

    for (const field of requiredFields) {
      const value = school[field.key];
      if (!value || String(value).trim() === "") {
        toast.error(`${field.label}을(를) 입력해주세요.`);
        return;
      }
    }

    // 유효성 추가 체크
    if (!isValidLoginId(school.loginId)) {
      toast.error("아이디는 영문+숫자만 가능합니다.");
      return;
    }

    if (!isValidPassword(school.loginPw)) {
      toast.error(
        "비밀번호는 숫자+특수문자를 포함해 8자 이상 12자 이하로 설정해주세요.",
      );
      return;
    }

    if (!isValidTeacherName(school.teacherName)) {
      toast.error(
        "매니저 이름은 영문/한글+숫자 조합, 2자 이상 10자 이하로 입력해주세요.",
      );
      return;
    }

    if (!isValidEmail(school.teacherEmail)) {
      toast.error("이메일 형식이 올바르지 않습니다.");
      return;
    }

    const onlyNums = school.teacherPhone.replace(/\D/g, "");
    if (onlyNums.length !== 11) {
      toast.error("전화번호는 11자리 숫자로 입력해주세요.");
      return;
    }

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

          <SearchAutocomplete
            onChange={(value) => {
              if (value) {
                const [schoolName, address] = value.name.split("(");

                setSchool({
                  ...school,
                  schoolCode: value.code,
                  officeCode: value.officeCode,
                  schoolName: schoolName,
                  schoolAnniversary: value.schoolAnniversary,
                  address: address.replace(")", ""),
                });
              }
            }}
          />
        </InputWrap>

        <InputWrap>
          <Label>아이디</Label>
          <Input
            value={school.loginId}
            onChange={(e) => {
              setSchool({ ...school, loginId: e.target.value });
            }}
            type="text"
          />
        </InputWrap>
        <InputWrap>
          <Label>비밀번호</Label>
          <Input
            value={school.loginPw}
            onChange={(e) => {
              setSchool({ ...school, loginPw: e.target.value });
            }}
            type="password"
          />
        </InputWrap>
        <InputWrap>
          <Label>매니저 이름</Label>
          <Input
            value={school.teacherName}
            onChange={(e) => {
              setSchool({ ...school, teacherName: e.target.value });
            }}
            type="text"
          />
        </InputWrap>
        <InputWrap>
          <Label>매니저 이메일</Label>
          <Input
            value={school.teacherEmail}
            onChange={(e) => {
              const value = e.target.value;
              setSchool({ ...school, teacherEmail: value });

              // setEmailValid(isValidEmail(value) || value === "");
            }}
            type="text"
          />
        </InputWrap>
        <InputWrap>
          <Label>매니저 전화번호</Label>
          <Input
            value={school.teacherPhone}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              setSchool({ ...school, teacherPhone: formatted });
            }}
            type="text"
          />
        </InputWrap>

        <InputWrap>
          <Label>종료일</Label>
          <FormDatePicker
            value={school.endAt}
            onChange={(e) => {
              setSchool({ ...school, endAt: e.target.value as string });
            }}
          />
        </InputWrap>

        <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Label>학교 상태</Label>
            <Toggle
              label={""}
              checked={school.schoolStatus}
              onChange={(e) => {
                setSchool({ ...school, schoolStatus: e });
              }}
            />
          </Box>
          <Box>
            <Label>학교 레벨</Label>
            <RadioWrap
              defaultValue="elementary"
              value={school.schoolLevel}
              onChange={(e) =>
                setSchool({
                  ...school,
                  schoolLevel: e.target.value as
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
