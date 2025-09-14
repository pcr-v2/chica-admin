import React from "react";

import LogsContainer from "@/app/(main)/logs/LogsContainer";
import { getMe } from "@/app/actions/auth/getMe";
import { getLogs } from "@/app/actions/logs/getLogsAction";

export default async function page() {
  const me = await getMe();

  const logs = await getLogs({
    schoolType: me.data?.type as "master" | "teacher",
  });

  return <LogsContainer logs={logs} />;
}
