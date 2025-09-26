import { Box, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useMemo, useRef, useState } from "react";

import LogTableContent from "@/app/(main)/logs/LogTable/LogTableContent";
import LogTableToolbar from "@/app/(main)/logs/LogTable/LogTableToolbar";
import LogConfig, { LogRow } from "@/app/(main)/logs/LogTable/useLogTable";
import useLogTable from "@/app/(main)/logs/LogTable/useLogTable";
import { getLogs, GetLogsResponse } from "@/app/actions/logs/getLogsAction";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";

interface IProps {
  logs: GetLogsResponse;
  schoolList: GetSchoolListResponse;
}

export default function LogTable(props: IProps) {
  const { logs, schoolList } = props;

  const currentDate = useRef(dayjs().format("YYYY-MM-DD"));

  const { data: logsData, refetch } = useQuery({
    queryKey: ["get-logs"],
    queryFn: () => getLogs({ schoolType: "master", date: currentDate.current }),
    initialData: logs,
  });

  const data = useMemo<LogRow[]>(() => {
    const source = logsData ?? logs;
    if (source?.code === "SUCCESS") {
      return source.result.data;
    }
    return [];
  }, [logsData, logs, refetch]);

  const { table } = useLogTable(data);

  return (
    <Wrapper>
      <LogTableToolbar
        data={data}
        onChangeDate={(value: string) => {
          currentDate.current = value;
          refetch();
        }}
        schoolList={schoolList}
        totalLog={logsData?.result?.totalCreatedRows ?? 0}
      />

      <LogTableContent table={table} totalData={data.length - 1} />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderRadius: "12px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
  };
});
