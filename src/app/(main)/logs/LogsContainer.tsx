"use client";

import { Box, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import FormDatePicker from "@/app/_components/common/FormDatePicker";
import RefreshBtn from "@/app/_components/common/RefreshBtn";
import { getLogs, GetLogsResponse } from "@/app/actions/logs/getLogsAction";

interface IProps {
  logs: GetLogsResponse;
}

export default function LogsContainer(props: IProps) {
  const { logs } = props;

  const [date, setDate] = useState("");

  const { data } = useQuery({
    queryKey: ["get-logs", date],
    queryFn: () => getLogs({ schoolType: "master", date }),
    initialData: logs,
  });

  return (
    <Wrapper>
      <TopPanel>
        <Title>
          {date === "" ? "오늘" : date} 총 {data?.result?.length}개의 log가 생성
          되었습니다.
        </Title>

        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <RefreshBtn onClick={() => setDate("")} />
          <FormDatePicker
            sx={{ width: "100%", maxWidth: "150px" }}
            offMinDate
            value={date} // dragDate가 있으면 그 값 사용
            onChange={(e) => {
              const newDate = e.target.value as string;
              setDate(newDate);
            }}
          />
        </Box>
      </TopPanel>

      <LogTable>
        <TableHeader>
          <TableHeaderColumn sx={{ width: "100%", maxWidth: "600px" }}>
            내용
          </TableHeaderColumn>
          <TableHeaderColumn sx={{ display: "flex", justifyContent: "center" }}>
            학교
          </TableHeaderColumn>
          <TableHeaderColumn sx={{ display: "flex", justifyContent: "center" }}>
            생성일
          </TableHeaderColumn>
          <TableHeaderColumn sx={{ display: "flex", justifyContent: "center" }}>
            상태
          </TableHeaderColumn>
        </TableHeader>

        {data?.result?.map((el, idx) => {
          return (
            <TableRow
              key={idx}
              style={{ color: el.logsStatus === "Ok" ? "#13BA81" : "#F44336" }}
            >
              <TableRowItem sx={{ width: "100%", maxWidth: "600px" }}>
                {el.content}
              </TableRowItem>
              <TableRowItem sx={{ justifyContent: "center" }}>
                {el.school?.schoolName}
              </TableRowItem>
              <TableRowItem sx={{ justifyContent: "center" }}>
                {dayjs(el.createdAt).format("YY.MM.DD(ddd)")}
              </TableRowItem>
              <TableRowItem sx={{ justifyContent: "center" }}>
                <StatusBadge status={el.logsStatus as string}>
                  {el.logsStatus}
                </StatusBadge>
              </TableRowItem>
            </TableRow>
          );
        })}
      </LogTable>
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
    flexDirection: "column",
    justifyContent: "center",
    padding: "32px 28px 64px",
    backgroundColor: "#fff",
  };
});

const TopPanel = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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

const TableRow = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    padding: "10px 16px",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    borderRadius: "10px 10px 0px 0px",
  };
});

const TableRowItem = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "90px",
    fontWeight: 400,
    display: "flex",
    color: "#464B53",
    textAlign: "start",
    alignItems: "center",
  };
});

const LogTable = styled(Box)(() => {
  return {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    maxHeight: "320px",
    borderRadius: "10px",
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
  };
});

const TableHeader = styled(Box)(() => {
  return {
    top: 0,
    zIndex: 10,
    width: "100%",
    display: "flex",
    position: "sticky",
    padding: "12px 16px",
    alignItems: "center",
    backgroundColor: "#F1F2F3",
    justifyContent: "space-between",
    borderRadius: "10px 10px 0px 0px",
  };
});

const TableHeaderColumn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "90px",
    fontWeight: 400,
    color: "#747D8A",
    textAlign: "start",
  };
});

const StatusBadge = styled(Box)<{ status: string }>(({ status }) => {
  return {
    fontSize: 12,
    width: "100%",
    padding: "4px",
    color: "#fff",
    fontWeight: 600,
    maxWidth: "40px",
    textAlign: "center",
    borderRadius: "100px",
    backgroundColor: status === "Ok" ? "#32C794" : "#F44336",
  };
});
