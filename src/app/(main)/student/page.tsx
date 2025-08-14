import { redirect } from "next/navigation";

import StudentContainer from "@/app/(main)/student/StudentContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";
import { getStudentList } from "@/app/actions/student/getStudentListAction";

export default async function page() {
  const me = await getMe();

  const studentList = await getStudentList({
    schoolId: me.data?.schoolId as string,
    schoolType: me.data?.type as "master" | "teacher",
  });

  const schoolList = await getSchoolList();

  if (me.code === "FAIL") {
    return redirect("/signin");
  }

  return (
    <StudentContainer
      me={me}
      studentList={studentList}
      schoolList={schoolList}
    />
  );
}
