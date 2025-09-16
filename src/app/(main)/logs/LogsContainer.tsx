"use client";

import { Box, styled } from "@mui/material";

import LogsTable from "@/app/(main)/logs/components/LogsTable";
import PassiveInsert from "@/app/(main)/logs/components/PassiveInsert";
import { GetLogsResponse } from "@/app/actions/logs/getLogsAction";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";

interface IProps {
  logs: GetLogsResponse;
  schoolList: GetSchoolListResponse;
}

export default function LogsContainer(props: IProps) {
  const { logs, schoolList } = props;

  return (
    <Wrapper>
      <LogsTable logs={logs} />
      <PassiveInsert schoolList={schoolList} />
    </Wrapper>
  );
}

const Wrapper = styled(Box)({
  gap: "40px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  borderRadius: "12px",
  flexDirection: "column",
  justifyContent: "center",
  padding: "32px 28px 64px",
  backgroundColor: "#fff",
});
