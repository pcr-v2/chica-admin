import { redirect } from "next/navigation";

import ScheduleContainer from "@/app/(main)/schedule/ScheduleContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";

export default async function page() {
  const me = await getMe();

  const schoolList = await getSchoolList();

  if (me.code === "FAIL") {
    return redirect("/signin");
  }

  return <ScheduleContainer me={me} schoolList={schoolList.result} />;
}
