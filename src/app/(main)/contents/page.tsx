import { Metadata } from "next";
import { redirect } from "next/navigation";

import ContentsContainer from "@/app/(main)/contents/ContentsContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getContentsList } from "@/app/actions/contents/getContentsListAction";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "콘텐츠 관리",
  };
}

export default async function page() {
  const me = await getMe();

  const contentsList = await getContentsList({
    schoolId: me.data?.schoolId as string,
  });

  if (me.code === "FAIL") {
    return redirect("/signin");
  }

  return <ContentsContainer me={me} contentsList={contentsList} />;
}
