"use client";

import React from "react";

import { GetStudentListResponse } from "@/app/actions/student/getStudentListAction";

interface IProps {
  studentList: GetStudentListResponse;
}

export default function StudentListContainer(props: IProps) {
  const { studentList } = props;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {studentList.result?.map((el) => {
        return (
          <div
            style={{ display: "flex", gap: "10px", padding: "8px 0px" }}
            key={el.id}
          >
            <span>{el.studentName}</span>
            <span>{el.studentGrade}학년</span>
            <span>{el.studentClass}반</span>
            <span>{el.studentNumber}번</span>
            <span>{el.studentGender === "male" ? "남" : "여"}</span>
            <span>{el.studentStatus ? "사용중" : "안사용중"}</span>
          </div>
        );
      })}
    </div>
  );
}
