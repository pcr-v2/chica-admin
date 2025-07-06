import React from "react";

import StudentAddForm from "@/app/(main)/student/add/StudentAddForm";
import { getMe } from "@/app/actions/auth/getMe";

export default async function page() {
  const me = await getMe();

  return <StudentAddForm me={me} />;
}
