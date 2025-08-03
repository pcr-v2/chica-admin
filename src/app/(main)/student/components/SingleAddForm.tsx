"use client";

import { Box, styled } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

import MasterSchoolFilter from "@/app/(main)/student/components/MasterSchoolFilter";
import StudentGradeFilter from "@/app/(main)/student/components/StudentGradeFilter";
import Input from "@/app/_components/common/Input";
import { Toggle } from "@/app/_components/common/Toggle";
import { AddStudentRequest } from "@/app/actions/student/addStudentAction";

export type TStudnetInfo = {
  studentGrade: number;
  studentClass: string;
  studentNumber: number;
  studentGender: "male" | "female";
  studentName: string;
  studentStatus: boolean;
};

interface IProps {
  isElementary: boolean;
  onClose: () => void;
  onConfirm: (value: AddStudentRequest["students"]) => void;
}

export default function SingleAddForm(props: IProps) {
  const { isElementary, onConfirm, onClose } = props;

  const [studentGrade, setStudentGrade] = useState<number | null>(null);
  const [studentClass, setStudentClass] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [studentGender, setStudentGender] = useState<"male" | "female">("male");
  const [studentName, setStudentName] = useState("");
  const [studentStatus, setStudentStatus] = useState(true);

  const isValid =
    studentGrade !== null &&
    studentClass.trim() !== "" &&
    studentNumber !== "" &&
    studentName.trim() !== "";

  const handleConfirm = () => {
    if (!isValid) {
      toast.error("모든 항목을 입력해 주세요.");
      return;
    }
    onConfirm([
      {
        studentGrade,
        studentClass,
        studentNumber: Number(studentNumber),
        studentGender,
        studentName,
        studentStatus,
      },
    ]);
  };

  return (
    <Wrapper>
      <Title>학생등록</Title>

      <ContentWrap>
        <Section>
          <TitleSpan>학교정보 입력</TitleSpan>

          <Box sx={{ width: "100%", display: "flex", gap: "16px" }}>
            <StudentGradeFilter
              isElementary={isElementary}
              onChange={(value) => setStudentGrade(value)}
              selectedGrade={studentGrade}
            />
            <Input
              onChange={(e) => setStudentClass(e.target.value)}
              value={studentClass}
              placeholder="반"
              type="text"
              sx={{ width: "84px" }}
            />
            <Input
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                setStudentNumber(onlyNums);
              }}
              value={studentNumber}
              placeholder="번호"
              sx={{ width: "84px" }}
              type="text"
              inputMode="numeric"
              maxLength={2}
            />
          </Box>
        </Section>

        <SectionWrap>
          <Section>
            <TitleSpan>성별</TitleSpan>

            <Box sx={{ width: "100%", display: "flex", gap: "4px" }}>
              <MaleBox
                gender={studentGender}
                onClick={() => setStudentGender("male")}
              >
                남
              </MaleBox>
              <FemaleBox
                gender={studentGender}
                onClick={() => setStudentGender("female")}
              >
                여
              </FemaleBox>
            </Box>
          </Section>

          <Section>
            <TitleSpan>이름</TitleSpan>

            <Input
              onChange={(e) => setStudentName(e.target.value)}
              value={studentName}
              placeholder="이름"
              type="text"
              sx={{ width: "165px" }}
            />
          </Section>

          <Section>
            <TitleSpan>사용여부</TitleSpan>

            <Toggle
              label={""}
              checked={studentStatus}
              onChange={(e) => setStudentStatus(e)}
            />
          </Section>
        </SectionWrap>
      </ContentWrap>
      <BtnWrap>
        <Btn sx={{ border: "1px solid #E0E0E0" }} onClick={onClose}>
          취소
        </Btn>
        <Btn
          onClick={handleConfirm}
          sx={{
            backgroundColor: isValid ? "#32C794" : "#f1f2f3",
            color: isValid ? "#fff" : "#D5D7DB",
            pointerEvents: isValid ? "auto" : "none",
          }}
        >
          등록
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
    gap: "28px",
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
    padding: "16px 12px 16px 24px",
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

const MaleBox = styled(Box)<{ gender: string }>(({ gender }) => {
  return {
    fontSize: 14,
    fontWeight: 400,
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "10px 14px",
    border: "1px solid #000",
    transition: "all 0.2s linear",
    color: gender === "male" ? "#fff" : "#D5D7DB",
    borderColor: gender === "male" ? "#13BA81" : "#e0e0e0",
    backgroundColor: gender === "male" ? "#32C794" : "#fff",
  };
});

const FemaleBox = styled(Box)<{ gender: string }>(({ gender }) => {
  return {
    fontSize: 14,
    fontWeight: 400,
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "10px 14px",
    border: "1px solid #000",
    transition: "all 0.2s linear",
    color: gender === "female" ? "#fff" : "#D5D7DB",
    borderColor: gender === "female" ? "#13BA81" : "#e0e0e0",
    backgroundColor: gender === "female" ? "#32C794" : "#fff",
  };
});

const SectionWrap = styled(Box)(() => {
  return {
    gap: "16px",
    width: "100%",
    display: "flex",
    alignItems: "center",
  };
});
