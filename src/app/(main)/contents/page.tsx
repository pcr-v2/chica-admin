import { redirect } from "next/navigation";

import ContentsContainer from "@/app/(main)/contents/ContentsContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getContentsList } from "@/app/actions/contents/getContentsListAction";

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
