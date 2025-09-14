import { redirect } from "next/navigation";

import { getMe } from "@/app/actions/auth/getMe";

export default async function Home() {
  const me = await getMe();

  if (me.data == null) return;

  if (me.data.type === "teacher") {
    throw redirect("/dashboard");
  }

  throw redirect("/logs");
}
