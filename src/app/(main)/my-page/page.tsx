import { Metadata } from "next";
import { redirect } from "next/navigation";

import MypageContainer from "@/app/(main)/my-page/components/MypageContainer";
import { getMe, GetMeResponse } from "@/app/actions/auth/getMe";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "마이페이지",
  };
}

export default async function page() {
  const me = await getMe();

  if (me.code === "FAIL") {
    return redirect("/signin");
  }

  return <MypageContainer me={me} />;
}
