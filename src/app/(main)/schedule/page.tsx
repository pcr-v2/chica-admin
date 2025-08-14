import ScheduleContainer from "@/app/(main)/schedule/ScheduleContainer";
import TestContainer from "@/app/(main)/schedule/TestContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";

export default async function page() {
  const me = await getMe();

  const schoolList = await getSchoolList();

  // return <ScheduleContainer me={me} schoolList={schoolList.result} />;
  return <TestContainer />;
}
