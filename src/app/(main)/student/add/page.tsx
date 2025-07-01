import React from "react";

import StudentAddForm from "@/app/(main)/student/add/StudentAddForm";
import { getMe } from "@/app/actions/auth/getMe";
import { School_type } from "@/prisma/generated/prisma";

export default async function page() {
  const me = await getMe();

  return <StudentAddForm me={me} />;
}
