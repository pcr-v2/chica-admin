import { Metadata } from "next";
import { redirect } from "next/navigation";

import DashboardContainer from "@/app/(main)/dashboard/DashboardContainer";
import MasterLogContainer from "@/app/_components/master/MasterLogContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getBarChartStatistic } from "@/app/actions/statistic/getBarChartStatistic";
import { getClassRankListStatistic } from "@/app/actions/statistic/getClassRankListStatistic";
import { getLineChartStatistic } from "@/app/actions/statistic/getLineChartStatistic";
import { getRankPageStatistic } from "@/app/actions/statistic/getRankPageStatistic";

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

  // 마스터 계정일 경우 Dashboard 데이터 스킵
  if (me.data?.type === "master") {
    return <MasterLogContainer me={me} />;
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

  const list = await getRankPageStatistic({
    schoolId: me.data?.schoolId as string,
    type: "term",
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
  // console.log("test", classRankList);
  return (
    <DashboardContainer
      me={me}
      list={list}
      lineRes={lineRes}
      barRes={barRes}
      classRankList={classRankList}
    />
  );
}
