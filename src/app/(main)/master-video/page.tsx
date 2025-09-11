import { Metadata } from "next";

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
    schoolId: "21a01ae2-2f60-4f7c-bcae-9fa4fc287564",
  });

  return <ContentsContainer contentsList={contentsList} me={me} />;
}
