import { Metadata } from "next";
import { redirect } from "next/navigation";

import DashboardContainer from "@/app/(main)/dashboard/DashboardContainer";
import { getMe } from "@/app/actions/auth/getMe";

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

  return <DashboardContainer me={me} />;
}
