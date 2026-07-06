import { Metadata } from "next";
import { redirect } from "next/navigation";

import DashboardContainer from "@/app/(main)/dashboard/DashboardContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";
import { getBarChartStatistic } from "@/app/actions/statistic/getBarChartStatistic";
import { getClassRankListStatistic } from "@/app/actions/statistic/getClassRankListStatistic";
import { getLineChartStatistic } from "@/app/actions/statistic/getLineChartStatistic";
import { getPersonalRankStatistic } from "@/app/actions/statistic/getPersonalRankStatistic";
import { getUnCheckedStatistic } from "@/app/actions/statistic/getUnCheckedStatistic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "대시보드",
  };
}

export default async function Page() {
  const me = await getMe();

  // 로그인 체크
  if (me.code !== "SUCCESS") {
    return redirect("/signin");
  }

  const schoolId = me.data.schoolId;

  const [
    personalRankList,
    lineRes,
    barRes,
    classRankList,
    schoolList,
    unCheckedList,
  ] = await Promise.all([
    getPersonalRankStatistic({
      schoolId,
      isTotal: true,
      searchRange: {
        startAt: "",
        endAt: "",
      },
    }),
    getLineChartStatistic({
      schoolId,
      type: "day",
    }),
    getBarChartStatistic({
      schoolId,
      type: "day",
    }),
    getClassRankListStatistic({
      schoolId,
      isTotal: true,
      searchRange: {
        startAt: "",
        endAt: "",
      },
    }),
    getSchoolList(),
    getUnCheckedStatistic({
      schoolId,
    }),
  ]);

  // console.log("test", classRankList);
  return (
    <DashboardContainer
      me={me}
      personalRankList={personalRankList}
      lineRes={lineRes}
      barRes={barRes}
      unCheckedList={unCheckedList}
      classRankList={classRankList}
      schoolList={schoolList}
    />
  );
}
