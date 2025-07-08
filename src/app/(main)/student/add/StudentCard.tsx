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
