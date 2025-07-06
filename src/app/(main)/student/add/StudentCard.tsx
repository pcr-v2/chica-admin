"use client";

import { Box, Button, styled } from "@mui/material";
import React, { useState } from "react";

import Input from "@/app/_components/common/Input";
import { csvStudentsBlukRegistSchema } from "@/app/actions/student/addStudentSchema";
import downloadCsv from "@/utils/downloadCsv";
import uploadCsv from "@/utils/uploadCsv";

type TStudent = {
  studentGrade: string;
  studentClass: string;
  studentNumber: string;
  studentName: string;
  studentGender: string;
  studentStatus: boolean;
};

interface IProps {
  schoolLevel: "elementary" | "middle" | "high";
}

const CSV_DEFAULT_DATAS = [
  {
    학생이름: "한지민",
    학년: "1",
    반: "3",
    번호: "24",
    성별: "남",
    학생사용여부: "Y",
  },
  {
    학생이름: "정소민",
    학년: "1",
    반: "3",
    번호: "24",
    성별: "남",
    학생사용여부: "Y",
  },
];

export default function StudentCard(props: IProps) {
  const { schoolLevel } = props;

  const [student, setStudent] = useState<TStudent[]>([
    {
      studentGrade: "1",
      studentClass: "",
      studentNumber: "",
      studentName: "",
      studentGender: "male",
      studentStatus: true,
    },
  ]);

  return (
    <Wrapper>
      <Button
        variant="contained"
        onClick={() => downloadCsv(CSV_DEFAULT_DATAS, "학생등록양식")}
      >
        다운테스트
      </Button>
      <Button
        variant="contained"
        onClick={async () => {
          const res = await uploadCsv(csvStudentsBlukRegistSchema);

          console.log("res", res);

          const updatedRes = res.map((el) => ({
            ...el,
            studentStatus: el.studentStatus === "Y" || el.studentStatus === "y",
            student_gender: el.studentGender === "남" ? "male" : "female",
          }));

          console.log(updatedRes);

          setStudent([...student, ...updatedRes]);
        }}
      >
        업로드 테스트
      </Button>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {student.map((el, idx) => {
          return (
            <div key={idx}>
              {el.studentName}
              {el.studentClass}반{el.studentGrade}학년
              {el.studentNumber}번{el.studentGender}
              {el.studentStatus.toString()}
            </div>
          );
        })}
      </Box>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "32px",
    width: "100%",
    display: "flex",
    borderRadius: "8px",
    padding: "32px 24px",
    backgroundColor: "#fafafa",
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
