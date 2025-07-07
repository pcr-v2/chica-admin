"use client";

import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import MasterSchoolSelect from "@/app/(main)/student/add/MasterSchoolSelect";
import StudentCard from "@/app/(main)/student/add/StudentCard";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { addStudent } from "@/app/actions/student/addStudentAction";

interface IProps {
  me: GetMeResponse;
}

export default function StudentAddForm(props: IProps) {
  const { me } = props;

  const [schoolId, setSchoolId] = useState("");

  useEffect(() => {
    if (!me.data) {
      return;
    }

    if (me.data.type === "teacher") {
      setSchoolId(me.data.schoolId as string);
    }
  }, [me]);

  const handleAdd = async () => {
    const res = await addStudent({
      schoolId: "1ad52d51-798d-41d0-b09e-3517238fc7b7",
      students: [
        {
          studentName: "추가11중학교 학생1",
          studentClass: "11반",
          studentGrade: 3,
          studentNumber: 1,
          studentGender: "male",
          studentStatus: true,
        },
        {
          studentName: "추가11중학교 학생2",
          studentClass: "11반",
          studentGrade: 3,
          studentNumber: 2,
          studentGender: "female",
          studentStatus: true,
        },
        {
          studentName: "추가11중학교 학생3",
          studentClass: "11반",
          studentGrade: 3,
          studentNumber: 3,
          studentGender: "male",
          studentStatus: true,
        },
      ],
    });

    if (res.code === "SUCCESS") {
      toast.success(res.message);
      // onSuccess();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div>
      <Button variant="contained" fullWidth onClick={handleAdd}>
        학생등록 테스트
      </Button>
      {me.data?.type === "master" && (
        <MasterSchoolSelect selectSchoolId={(value) => setSchoolId(value)} />
      )}

      {/* {schoolId} */}

      {schoolId !== "" && (
        <StudentCard
          schoolLevel={me.data?.schoolLevel as "elementary" | "middle" | "high"}
        />
      )}
    </div>
  );
}
