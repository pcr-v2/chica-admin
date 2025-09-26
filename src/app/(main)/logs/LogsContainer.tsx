"use client";

import { Box, styled } from "@mui/material";

import LogTable from "@/app/(main)/logs/LogTable";
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
      {/* <LogsTable logs={logs} /> */}
      <LogTable logs={logs} schoolList={schoolList} />

      {/* <PassiveWrap>
        <PassiveInsert schoolList={schoolList} />
        <Divider />
        <PassiveDelete schoolList={schoolList} />
      </PassiveWrap> */}
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

const PassiveWrap = styled(Box)(() => {
  return {
    gap: "36px",
    width: "100%",
    display: "flex",
    alignItems: "center",
  };
});

const Divider = styled(Box)(() => {
  return {
    width: "1px",
    height: "160px",
    backgroundColor: "#9e9e9e",
  };
});
