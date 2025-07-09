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
    schoolStatus: true,
    schoolLevel: "elementary",
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

          <SearchAutocomplete
            onChange={(value) => {
              if (value) {
                const [schoolName, address] = value.name.split("-");

                setSchool({
                  ...school,
                  schoolCode: value.code,
                  officeCode: value.officeCode,
                  schoolName: schoolName,
                  address: address,
                });
              }
            }}
          />
        </InputWrap>

        {/* <InputWrap>
          <SchoolAutoComplete
            options={options}
            onChange={(id) => {
              setSelectedSchoolId(id);
            }}
          />
        </InputWrap> */}
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
            type="text"
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
              setSchool({ ...school, teacherEmail: e.target.value });
            }}
            type="text"
          />
        </InputWrap>
        <InputWrap>
          <Label>매니저 전화번호</Label>
          <Input
            value={school.teacherPhone}
            onChange={(e) => {
              setSchool({ ...school, teacherPhone: e.target.value });
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
