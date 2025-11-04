import { Metadata } from "next";

import StatisticContainer from "@/app/(main)/statistic/components/StatisticContainer";
import { getMe } from "@/app/actions/auth/getMe";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "통계자료",
  };
}

export default async function page() {
  const me = await getMe();

  return <StatisticContainer me={me} />;
}
