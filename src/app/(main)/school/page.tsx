import SchoolContainer from "@/app/(main)/school/SchoolContainer";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";

export const dynamic = "force-dynamic";
export default async function Page() {
  const res = await getSchoolList();

  return <SchoolContainer schoolList={res} />;
}
