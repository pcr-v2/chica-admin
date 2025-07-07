import React from "react";

import SchoolList from "@/app/(main)/school/list/SchoolList";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";

export const dynamic = "force-dynamic";
export default async function Page() {
  const res = await getSchoolList();

  return <SchoolList schoolList={res} />;
}
