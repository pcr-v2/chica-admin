import ScheduleContainer from "@/app/(main)/schedule/ScheduleContainer";
import TestContainer from "@/app/(main)/schedule/TestContainer";
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

  // console.log("getHolidays", getH.olidays);

  // return <ScheduleContainer me={me} schoolList={schoolList.result} />;
  return (
    <TestContainer
      me={me}
      scheduleList={scheduleList.result as MergedSchedule}
    />
  );
}
