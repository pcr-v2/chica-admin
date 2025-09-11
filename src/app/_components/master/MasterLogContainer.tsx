"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe, GetMeResponse } from "@/app/actions/auth/getMe";

interface IProps {
  me: GetMeResponse;
}
export default function MasterLogContainer(props: IProps) {
  const { me } = props;

  const { data, isFetching } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    // refetchOnMount: true, // 강제로 마운트 시 fetch
    // refetchOnWindowFocus: false,
    // initialData: me,
  });

  console.log(me);

  // console.log("data", data);
  // console.log("isFetching", isFetching);

  return <div></div>;
}
