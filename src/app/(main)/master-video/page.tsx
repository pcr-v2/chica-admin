import React from "react";

import ContentsContainer from "@/app/(main)/contents/ContentsContainer";
import VideoContainer from "@/app/(main)/video/VideoContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getContentsList } from "@/app/actions/contents/getContentsListAction";

export default async function page() {
  const me = await getMe();

  const contentsList = await getContentsList({
    schoolId: me.data?.schoolId as string,
  });

  return <ContentsContainer contentsList={[]} me={me} />;
}
