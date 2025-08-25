import { redirect } from "next/navigation";

import DashboardContainer from "@/app/(main)/dashboard/DashboardContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getBarChartStatistic } from "@/app/actions/statistic/getBarChartStatistic";
import { getLineChartStatistic } from "@/app/actions/statistic/getLineChartStatistic";
import { getRankPageStatistic } from "@/app/actions/statistic/getRankPageStatistic";

export default async function page() {
  const me = await getMe();

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
  // console.log("list", list);

  if (me.code === "FAIL") {
    return redirect("/signin");
  }

  return (
    <DashboardContainer me={me} list={list} lineRes={lineRes} barRes={barRes} />
  );
}
