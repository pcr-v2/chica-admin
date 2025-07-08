import React from "react";

import StudentAddForm from "@/app/(main)/student/add/StudentAddForm";
import { getMe } from "@/app/actions/auth/getMe";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";

export default async function page() {
  const me = await getMe();

  const schoolList = await getSchoolList();

  return <StudentAddForm me={me} schoolList={schoolList} />;
}
