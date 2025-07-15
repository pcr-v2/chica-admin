import CsListContainer from "@/app/(main)/cs/list/CsListContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getCsList } from "@/app/actions/cs/getCsListAction";

export default async function page() {
  const me = await getMe();
  const csList = await getCsList({
    schoolId: me.data?.schoolId as string,
    type: me.data?.type as "master" | "teacher",
  });
  return <CsListContainer me={me} csList={csList} />;
}
