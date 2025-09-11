import { Metadata } from "next";

import SchoolContainer from "@/app/(main)/school/SchoolContainer";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "학교 관리",
  };
}

export default async function Page() {
  const res = await getSchoolList();

  return <SchoolContainer schoolList={res} />;
}
