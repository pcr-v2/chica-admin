import StudentListContainer from "@/app/(main)/student/list/StudentListContainer";
import { getStudentList } from "@/app/actions/student/getStudentListAction";

export default async function page() {
  const studentList = await getStudentList({
    schoolId: "1ad52d51-798d-41d0-b09e-3517238fc7b7",
    schoolType: "teacher",
  });

  return <StudentListContainer studentList={studentList} />;
}
