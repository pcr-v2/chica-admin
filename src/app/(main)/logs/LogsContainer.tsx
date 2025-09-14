"use client";

import { Box, styled } from "@mui/material";
import { useMemo } from "react";

import { GetLogsResponse } from "@/app/actions/logs/getLogsAction";

interface IProps {
  logs: GetLogsResponse;
}

export default function LogsContainer(props: IProps) {
  const { logs } = props;
  console.log("logs?.result", logs?.result);
  return (
    <Wrapper>
      <Title>오늘 총 {logs?.result?.length}개의 log가 생성 되었습니다.</Title>
      <div>
        {logs?.result?.map((el, idx) => {
          return (
            <TableRowItem
              key={idx}
              style={{
                color: el.logsStatus === "Ok" ? "#13BA81" : "#F44336",
              }}
            >
              {el.content}
            </TableRowItem>
          );
        })}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderRadius: "24px",
    padding: "32px 28px 64px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
  };
});

const Title = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    fontWeight: 600,
    display: "flex",
    color: "#747D8A",
    justifyContent: "start",
  };
});

const TableHeader = styled(Box)(() => ({
  gap: "40px",
  width: "100%",
  display: "flex",
  padding: "12px 16px",
  alignItems: "center",
  backgroundColor: "#F7F8FA",
  justifyContent: "start",
  flexDirection: "column",
  borderRadius: "10px 10px 0px 0px",
}));

const TableHeaderColumn = styled(Box)(() => ({
  fontSize: 16,
  fontWeight: 400,
  color: "#747D8A",
  textAlign: "start",
  justifyContent: "start",
  display: "flex",
  flex: 1,
  minWidth: 0,
}));

const TableRow = styled(Box)(() => ({
  gap: "40px",
  height: "80px",
  display: "flex",
  padding: "0px 16px",
  alignItems: "center",
  backgroundColor: "#fff",
  borderBottom: "1px solid #F3F3F3",
}));

const TableRowItem = styled(Box)(() => ({
  fontSize: 18,
  display: "flex",
  fontWeight: 400,
  color: "#080808",
  alignItems: "center",
  flex: 1,
  minWidth: 0,
}));
