import MypageContainer from "@/app/(main)/my-page/components/MypageContainer";
import { getMe, GetMeResponse } from "@/app/actions/auth/getMe";

export default async function page() {
  const me = await getMe();

  return <MypageContainer me={me} />;
}
