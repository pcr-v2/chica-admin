"use client";

import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import MasterSchoolFilter from "@/app/(main)/student/components/MasterSchoolFilter";
import StudentGradeFilter from "@/app/(main)/student/components/StudentGradeFilter";
import Input from "@/app/_components/common/Input";
import { Toggle } from "@/app/_components/common/Toggle";
import { AddStudentRequest } from "@/app/actions/student/addStudentAction";
import { GetStudentResponse } from "@/app/actions/student/getStudentAction";

export type TStudnetInfo = {
  studentGrade: number;
  studentClass: string;
  studentNumber: number;
  studentGender: "male" | "female";
  studentName: string;
  studentStatus: boolean;
};

interface IProps {
  updatedData: GetStudentResponse["result"];
  isElementary: boolean;
  onClose: () => void;
  onDelete: (studentId: string) => void;
  onConfirm: (value: AddStudentRequest["students"]) => void;
}

export default function SingleAddForm(props: IProps) {
  const { isElementary, updatedData, onConfirm, onClose, onDelete } = props;

  const [studentGrade, setStudentGrade] = useState<number | null>(
    updatedData?.studentGrade ?? null,
  );
  const [studentClass, setStudentClass] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [studentGender, setStudentGender] = useState<"male" | "female">("male");
  const [studentName, setStudentName] = useState("");
  const [studentStatus, setStudentStatus] = useState(true);

  useEffect(() => {
    if (updatedData) {
      setStudentGrade(updatedData.studentGrade);
      setStudentClass(updatedData.studentClass);
      setStudentNumber(String(updatedData.studentNumber));
      setStudentGender(updatedData.studentGender);
      setStudentName(updatedData.studentName);
      // setStudentStatus(updatedData.studentStatus);
    }
  }, [updatedData]);

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
              isUpdate={updatedData != null}
              isElementary={isElementary}
              onChange={(value) => setStudentGrade(value)}
              selectedGrade={studentGrade}
            />
            <Input
              disabled={updatedData?.studentClass != null}
              onChange={(e) => setStudentClass(e.target.value)}
              value={studentClass}
              placeholder="반"
              type="text"
              sx={{ width: "100%" }}
            />
            <Input
              disabled={updatedData?.studentNumber != null}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                setStudentNumber(onlyNums);
              }}
              value={studentNumber}
              placeholder="번호"
              sx={{ width: "100%" }}
              type="text"
              inputMode="numeric"
              maxLength={2}
            />
          </Box>
        </Section>

        <SectionWrap>
          <Section style={{ width: "unset" }}>
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
              sx={{ width: "100%" }}
            />
          </Section>
        </SectionWrap>
      </ContentWrap>
      <BtnWrap
        sx={{
          justifyContent: updatedData != null ? "space-between" : "end",
        }}
      >
        {updatedData && (
          <DeleteBtn onClick={() => onDelete(updatedData.studentId)}>
            삭제
          </DeleteBtn>
        )}

        <Box sx={{ display: "flex", gap: "16px" }}>
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
        </Box>
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
    display: "flex",
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

const DeleteBtn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "60px",
    fontWeight: 500,
    color: "#fff",
    cursor: "pointer",
    padding: "8px 12px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "#F44336",
  };
});

const MaleBox = styled(Box)<{ gender: string }>(({ gender }) => {
  return {
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "10px 14px",
    border: "1px solid #000",
    transition: "all 0.1s linear",
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
