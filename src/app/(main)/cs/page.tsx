import { redirect } from "next/navigation";

import CsContainer from "@/app/(main)/cs/CsContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getCsList } from "@/app/actions/cs/getCsListAction";

export default async function page() {
  const me = await getMe();

  const csList = await getCsList({
    schoolId: me.data?.schoolId as string,
    type: me.data?.type as "master" | "teacher",
  });

  if (me.code === "FAIL") {
    return redirect("/signin");
  }

  return <CsContainer me={me} csList={csList} />;
}
