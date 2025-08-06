import ScheduleContainer from "@/app/(main)/schedule/ScheduleContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getSchedule } from "@/app/actions/schedule/getScheduleListAction";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";

export default async function page() {
  const me = await getMe();

  const schoolList = await getSchoolList();

  return <ScheduleContainer me={me} schoolList={schoolList.result} />;
}
