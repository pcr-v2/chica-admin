import ScheduleContainer from "@/app/(main)/schedule/ScheduleContainer";
import { getMe } from "@/app/actions/auth/getMe";
import {
  getScheduleList,
  MergedSchedule,
} from "@/app/actions/schedule/getScheduleListAction";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";

export default async function page() {
  const me = await getMe();

  const schoolList = await getSchoolList();

  const scheduleList = await getScheduleList({
    schoolId: me.data?.schoolId as string,
  });

  return (
    <ScheduleContainer
      me={me}
      schoolList={schoolList.result}
      scheduleList={scheduleList.result as MergedSchedule}
    />
  );
}
