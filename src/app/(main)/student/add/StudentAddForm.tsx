"use client";

import React, { useEffect, useState } from "react";

import MasterSchoolSelect from "@/app/(main)/student/add/MasterSchoolSelect";
import StudentCard from "@/app/(main)/student/add/StudentCard";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { School_type } from "@/prisma/generated/prisma";

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

  return (
    <div>
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
