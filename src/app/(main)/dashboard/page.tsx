import DashboardContainer from "@/app/(main)/dashboard/DashboardContainer";
import { getMe } from "@/app/actions/auth/getMe";

export default async function page() {
  const me = await getMe();

  return <DashboardContainer type={me.data?.type as "master" | "teacher"} />;
}
