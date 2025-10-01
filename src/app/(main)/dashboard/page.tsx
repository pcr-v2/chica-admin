import { Metadata } from "next";
import { redirect } from "next/navigation";

import DashboardContainer from "@/app/(main)/dashboard/DashboardContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";
import { getBarChartStatistic } from "@/app/actions/statistic/getBarChartStatistic";
import { getClassRankListStatistic } from "@/app/actions/statistic/getClassRankListStatistic";
import { getLineChartStatistic } from "@/app/actions/statistic/getLineChartStatistic";
import { getPersonalRankStatistic } from "@/app/actions/statistic/getPersonalRankStatistic";
import { getRankPageStatistic } from "@/app/actions/statistic/getRankPageStatistic";
import { getUnCheckedStatistic } from "@/app/actions/statistic/getUnCheckedStatistic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "대시보드",
  };
}

export default async function Page() {
  const me = await getMe();

  // 로그인 체크
  if (me.code === "FAIL") {
    return redirect("/signin");
  }

  // 일반 사용자 → Dashboard 데이터 로드
  // const [list, lineRes, barRes] = await Promise.all([
  //   getRankPageStatistic({
  //     schoolId: me.data?.schoolId as string,
  //     type: "term",
  //   }),
  //   getLineChartStatistic({
  //     schoolId: me.data?.schoolId as string,
  //     type: "day",
  //   }),
  //   getBarChartStatistic({
  //     schoolId: me.data?.schoolId as string,
  //     type: "day",
  //   }),
  // ]);

  const personalRankList = await getPersonalRankStatistic({
    schoolId: me.data?.schoolId as string,
    isTotal: true,
    searchRange: {
      startAt: "",
      endAt: "",
    },
  });

  const lineRes = await getLineChartStatistic({
    schoolId: me.data?.schoolId as string,
    type: "day",
  });
  const barRes = await getBarChartStatistic({
    schoolId: me.data?.schoolId as string,
    type: "day",
  });

  const classRankList = await getClassRankListStatistic({
    schoolId: me.data?.schoolId as string,
    isTotal: true,
    searchRange: {
      startAt: "",
      endAt: "",
    },
  });

  const schoolList = await getSchoolList();

  const unCheckedList = await getUnCheckedStatistic({
    schoolId: me.data?.schoolId as string,
  });

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
