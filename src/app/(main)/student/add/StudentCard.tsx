"use client";

import { Box, Button, styled } from "@mui/material";
import React, { useState } from "react";

import Input from "@/app/_components/common/Input";
import { csvStudentsBlukRegistSchema } from "@/app/actions/student/addStudentSchema";
import downloadCsv from "@/utils/downloadCsv";
import uploadCsv from "@/utils/uploadCsv";

type TStudent = {
  student_grade: string;
  student_class: string;
  student_number: string;
  student_name: string;
  student_gender: string;
  student_status: boolean;
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
      student_grade: "1",
      student_class: "",
      student_number: "",
      student_name: "",
      student_gender: "male",
      student_status: true,
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
            student_status:
              el.student_status === "Y" || el.student_status === "y",
            student_gender: el.student_gender === "남" ? "male" : "female",
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
              {el.student_name}
              {el.student_class}반{el.student_grade}학년
              {el.student_number}번{el.student_gender}
              {el.student_status.toString()}
            </div>
          );
        })}
      </Box>
      {/* <InputWrap>
        <Label>이름</Label>
        <Input
          value={student.student_name}
          onChange={(e) => {
            setStudent({ ...student, student_name: e.target.value });
          }}
          type="text"
        />
      </InputWrap>
      <InputWrap>
        <Label>학년</Label>
        <Input
          value={student.student_name}
          onChange={(e) => {
            setStudent({ ...student, student_name: e.target.value });
          }}
          type="text"
        />
      </InputWrap>
      <InputWrap>
        <Label>반</Label>
        <Input
          value={student.student_name}
          onChange={(e) => {
            setStudent({ ...student, student_name: e.target.value });
          }}
          type="text"
        />
      </InputWrap>
      <InputWrap>
        <Label>번호</Label>
        <Input
          value={student.student_name}
          onChange={(e) => {
            setStudent({ ...student, student_name: e.target.value });
          }}
          type="text"
        />
      </InputWrap>
      <InputWrap>
        <Label>성별</Label>
        <Input
          value={student.student_name}
          onChange={(e) => {
            setStudent({ ...student, student_name: e.target.value });
          }}
          type="text"
        />
      </InputWrap>
      <InputWrap>
        <Label>학생 사용여부</Label>
        <Input
          value={student.student_name}
          onChange={(e) => {
            setStudent({ ...student, student_name: e.target.value });
          }}
          type="text"
        />
      </InputWrap> */}
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
    // flexDirection: "column",
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
