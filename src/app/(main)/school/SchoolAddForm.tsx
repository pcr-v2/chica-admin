"use client";

import {
  Box,
  Button,
  Radio,
  RadioGroup,
  RadioProps,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import FormDatePicker from "@/app/_components/common/FormDatePicker";
import Input from "@/app/_components/common/Input";
import SearchAutocomplete from "@/app/_components/common/SearchAutoComplete";
import { Toggle } from "@/app/_components/common/Toggle";
import { addSchool } from "@/app/actions/school/addSchoolAction";
import { GetSchoolResponse } from "@/app/actions/school/getSchoolAction";
import { updateSchool } from "@/app/actions/school/updateSchoolAction";
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
  startAt: string;
  endAt: string;
  schoolStatus: boolean;
  schoolAnniversary: string;
  schoolLevel: "elementary" | "middle" | "high";
};

interface IProps {
  updatedData: GetSchoolResponse["result"];
  onClose: () => void;
  onSuccess: () => void;
}

export default function SchoolAddForm(props: IProps) {
  const { updatedData, onSuccess, onClose } = props;
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
    startAt: "",
    endAt: "",
    schoolAnniversary: "",
    schoolStatus: true,
    schoolLevel: "elementary",
  });

  useEffect(() => {
    if (!open) {
      setSchool({
        schoolName: "",
        loginId: "",
        loginPw: "",
        schoolCode: "",
        officeCode: "",
        teacherName: "",
        teacherEmail: "",
        teacherPhone: "",
        address: "",
        startAt: "",
        endAt: "",
        schoolAnniversary: "",
        schoolStatus: true,
        schoolLevel: "elementary",
      });
    }
  }, [open]);

  useEffect(() => {
    if (updatedData == null) return;

    setSchool({
      schoolName: updatedData.schoolName,
      loginId: updatedData.loginId,
      loginPw: "", // 항상 초기화
      schoolCode: updatedData.schoolCode,
      officeCode: updatedData.officeCode,
      teacherName: updatedData.teacherName,
      teacherEmail: updatedData.teacherEmail,
      teacherPhone: updatedData.teacherPhone,
      address: updatedData.address,
      startAt: dayjs(updatedData.startAt).toISOString(),
      endAt: dayjs(updatedData.endAt).toISOString(),
      schoolAnniversary: "",
      schoolStatus: updatedData.schoolStatus,
      schoolLevel: updatedData.schoolLevel,
    });
  }, [updatedData]);

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

    // console.log(school);

    if (updatedData == null) {
      const res = await addSchool(school);
      if (res.code === "SUCCESS") {
        toast.success(res.message);
        onSuccess();
      } else {
        toast.error(res.message);
      }
    } else {
      const res = await updateSchool({
        schoolId: updatedData.schoolId,
        ...school,
      });
      if (res.code === "SUCCESS") {
        toast.success(res.message);
        onSuccess();
      } else {
        toast.error(res.message);
      }
    }
  };

  const isFormComplete = () => {
    const requiredFields: (keyof TSchool)[] = [
      "schoolName",
      "loginId",
      "loginPw",
      "teacherName",
      "teacherEmail",
      "teacherPhone",
      "endAt",
    ];

    return requiredFields.every((key) => {
      const value = school[key];
      if (typeof value === "boolean") return true;
      return !!value && String(value).trim().length > 0;
    });
  };

  return (
    <Wrapper>
      <Title>학교등록</Title>
      <ContentWrap>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Section>
            <TitleSpan>학교명</TitleSpan>
            <SearchAutocomplete
              defaultSchoolName={updatedData?.schoolName}
              onChange={(value) => {
                if (value) {
                  const [schoolName, address] = value.name.split("(");

                  setSchool((prev) => ({
                    ...prev,
                    schoolCode: value.code,
                    officeCode: value.officeCode,
                    schoolName: schoolName,
                    schoolAnniversary: value.schoolAnniversary,
                    address: address.replace(")", ""),
                  }));
                }
              }}
            />
          </Section>
        </Box>
        <Box sx={{ width: "100%", display: "flex", gap: "16px" }}>
          <Section>
            <TitleSpan>아이디</TitleSpan>
            <Input
              value={school.loginId}
              onChange={(e) => {
                setSchool({ ...school, loginId: e.target.value });
              }}
              placeholder="아이디"
              type="text"
            />
          </Section>
          <Section>
            <TitleSpan>비밀번호</TitleSpan>
            <Input
              value={school.loginPw}
              onChange={(e) => {
                setSchool({ ...school, loginPw: e.target.value });
              }}
              placeholder="비밀번호"
              type="password"
            />
          </Section>
        </Box>
        <Box sx={{ width: "100%", display: "flex", gap: "16px" }}>
          <Section>
            <TitleSpan>담당자 이름</TitleSpan>
            <Input
              value={school.teacherName}
              onChange={(e) => {
                setSchool({ ...school, teacherName: e.target.value });
              }}
              type="text"
              placeholder="담당자 이름"
            />
          </Section>

          <Section>
            <TitleSpan>담당자 전화번호</TitleSpan>
            <Input
              value={school.teacherPhone}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                setSchool({ ...school, teacherPhone: formatted });
              }}
              type="text"
              placeholder="010-1234-5678"
            />
          </Section>
        </Box>
        <Section>
          <TitleSpan>이메일</TitleSpan>
          <Input
            value={school.teacherEmail}
            onChange={(e) => {
              const value = e.target.value;
              setSchool({ ...school, teacherEmail: value });

              // setEmailValid(isValidEmail(value) || value === "");
            }}
            type="text"
            placeholder="이메일"
          />
        </Section>

        <Section>
          <TitleSpan>사용기한</TitleSpan>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "16px",
              height: 41,
              alignItems: "center",
            }}
          >
            <FormDatePicker
              value={
                school.startAt === ""
                  ? dayjs().format("YYYY-MM-DD")
                  : school.startAt
              }
              onChange={(e) => {
                // console.log("e.target.value", e.target.value);
                setSchool({ ...school, startAt: e.target.value as string });
              }}
            />
            <span>~</span>
            <FormDatePicker
              value={school.endAt}
              onChange={(e) => {
                setSchool({ ...school, endAt: e.target.value as string });
              }}
            />
          </Box>
        </Section>
        <Section>
          <Box sx={{ width: "100%", display: "flex", gap: "16px" }}>
            <Section>
              <TitleSpan>학교 레벨</TitleSpan>
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
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <CustomRadio value="elementary" />초
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <CustomRadio value="middle" />중
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <CustomRadio value="high" />고
                  </Box>
                </Box>
              </RadioWrap>
            </Section>

            <Box
              sx={{
                gap: "8px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "space-between",
              }}
            >
              <TitleSpan>학교 상태</TitleSpan>
              <Toggle
                label={""}
                checked={school.schoolStatus}
                onChange={(e) => {
                  setSchool({ ...school, schoolStatus: e });
                }}
              />
            </Box>
          </Box>
        </Section>
      </ContentWrap>

      <BtnWrap>
        <Btn sx={{ border: "1px solid #E0E0E0" }} onClick={onClose}>
          취소
        </Btn>
        <Btn
          onClick={handleAdd}
          sx={{
            backgroundColor: isFormComplete() ? "#32C794" : "#f1f2f3",
            color: isFormComplete() ? "#fff" : "#D5D7DB",
            pointerEvents: isFormComplete() ? "auto" : "none",
          }}
        >
          저장
        </Btn>
      </BtnWrap>
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

const Title = styled(Box)(() => {
  return {
    width: "100%",
    fontSize: 20,
    fontWeight: 600,
    color: "#13BA81",
    textAlign: "start",
    backgroundColor: "#EDFCF7",
    padding: "16px 12px 16px 24px",
    borderRadius: "12px 12px 0px 0px",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    gap: "24px",
    width: "100%",
    display: "flex",
    padding: "28px",
    flexDirection: "column",
  };
});

const Section = styled(Box)(() => {
  return {
    gap: "8px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const TitleSpan = styled("span")(() => {
  return {
    fontSize: 16,
    fontWeight: 500,
    color: "#747D8A",
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    gap: "16px",
    display: "flex",
    justifyContent: "end",
    padding: "16px 28px 28px",
  };
});

const Btn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "88px",
    fontWeight: 500,
    cursor: "pointer",
    color: "#464B53",
    padding: "8px 12px",
    textAlign: "center",
    borderRadius: "8px",
  };
});

const CustomRadio = styled((props: RadioProps) => (
  <Radio disableRipple {...props} />
))(({ theme }) => ({
  padding: 0,
  margin: 0,
  width: 24,
  height: 24,
  position: "relative",
  "&:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiSvgIcon-root": {
    display: "none", // 기본 원 숨기기
  },
  "& .MuiTouchRipple-root": {
    display: "none",
  },

  // ✅ 디폴트 상태
  "&::before": {
    content: '""',
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: "50%",
    border: "1px solid #d9d9d9", // 디폴트 보더 컬러
    backgroundColor: "#fff",
    boxSizing: "border-box",
    transition: "all 0.2s linear",
  },

  // ✅ 체크된 상태
  "&.Mui-checked": {
    "&::before": {
      backgroundColor: "#32C794",
      borderColor: "#13BA81",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 20,
      height: 20,
      backgroundImage: 'url("/images/icons/radio-icon.svg")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
      transform: "translate(-50%, -50%)",
    },
  },
}));

const RadioWrap = styled(RadioGroup)(() => {
  return {
    "& .MuiRadio-root": {
      margin: 0,
      padding: 0,
    },
  };
});
