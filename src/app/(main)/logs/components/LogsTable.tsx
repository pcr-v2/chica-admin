"use client";

import { Box, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import FormDatePicker from "@/app/_components/common/FormDatePicker";
import RefreshBtn from "@/app/_components/common/RefreshBtn";
import { getLogs, GetLogsResponse } from "@/app/actions/logs/getLogsAction";

interface IProps {
  logs: GetLogsResponse;
}

type LogRow = {
  id: number;
  schoolId: string | null;
  createdAt: Date;
  school: { schoolName: string } | null;
  content: string | null;
  logsStatus: "Ok" | "No" | null;
  count: number | null;
  grade: string | null;
  reason: string | null;
};

export default function LogsTable({ logs }: IProps) {
  const today = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(today);

  const { data: logsData } = useQuery({
    queryKey: ["get-logs", date],
    queryFn: () => getLogs({ schoolType: "master", date }),
    initialData: logs,
  });

  const data = useMemo<LogRow[]>(() => {
    const source = logsData ?? logs;
    if (source?.code === "SUCCESS") {
      return source.result.data;
    }
    return [];
  }, [logsData, logs]);

  const columns = useMemo<ColumnDef<LogRow>[]>(
    () => [
      // 상태 (문자열 정렬)
      {
        id: "logStatus",
        header: () => (
          <HeaderCenter width="50px" sx={{ cursor: "pointer" }}>
            상태
          </HeaderCenter>
        ),
        accessorFn: (row) => row.logsStatus ?? "",
        cell: ({ getValue }) => (
          <CellCenter width="50px">
            <StatusBadge status={String(getValue())}>
              {String(getValue())}
            </StatusBadge>
          </CellCenter>
        ),
        sortingFn: "alphanumeric",
      },
      // 학교
      {
        id: "schoolName",
        header: () => (
          <HeaderCenter width="140px" sx={{ cursor: "pointer" }}>
            학교
          </HeaderCenter>
        ),
        accessorFn: (row) => row.school?.schoolName ?? "",
        cell: ({ row }) => (
          <CellCenter width="140px" sx={{ display: "block" }}>
            {row.original.school?.schoolName}
          </CellCenter>
        ),
        sortingFn: (rowA, rowB, columnId) => {
          const a = rowA.getValue<string>(columnId);
          const b = rowB.getValue<string>(columnId);
          return a.localeCompare(b, "ko"); // 한글 기준 정렬
        },
      },
      // 학년 (숫자 정렬)
      {
        id: "grade",
        header: () => (
          <HeaderCenter width="80px" sx={{ cursor: "pointer" }}>
            학년
          </HeaderCenter>
        ),
        accessorFn: (row) => {
          const match = row.grade?.match(/\d+/); // 숫자만 추출
          return match ? parseInt(match[0]) : 0;
        },
        cell: ({ row }) => (
          <CellCenter width="80px">{row.original.grade}</CellCenter>
        ),
        sortingFn: "basic", // 숫자 기준 정렬
      },
      // 생성일 (날짜 정렬)
      {
        id: "createdAt",
        header: () => <HeaderCenter width="120px">생성일</HeaderCenter>,
        accessorFn: (row) => new Date(row.createdAt).getTime(),
        cell: ({ getValue }) => (
          <CellCenter width="120px">
            {dayjs(getValue() as Date).format("YY.MM.DD(ddd)")}
          </CellCenter>
        ),
        enableSorting: false, // 정렬 OFF
      },
      // 내용 (문자열 정렬)
      {
        id: "content",
        header: () => <HeaderStart>내용</HeaderStart>,
        accessorFn: (row) => row.content ?? "",
        cell: ({ row }) => <CellStart>{row.original.content}</CellStart>,
        enableSorting: false, // 정렬 OFF
      },
    ],
    [],
  );

  const table = useReactTable<LogRow>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const okCount = data.filter((el) => el.logsStatus === "Ok").length;
  const noCount = data.filter((el) => el.logsStatus === "No").length;

  return (
    <Wrapper>
      <TopPanel>
        <Title>
          {date === today ? `${date}(오늘)` : `${date}일`} 총{" "}
          {logsData?.result?.totalCreatedRows}개의 row가 생성되었습니다.
          {` (Ok:${okCount}개 / No:${noCount}개)`}
        </Title>
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <RefreshBtn onClick={() => setDate(today)} />
          <FormDatePicker
            sx={{ width: "100%", maxWidth: "150px" }}
            offMinDate
            value={date}
            onChange={(e) => setDate(e.target.value as string)}
          />
        </Box>
      </TopPanel>

      <LogTable>
        <TableHeader>
          {table.getHeaderGroups().map((group) =>
            group.headers.map((header) => (
              <div
                key={header.id}
                onClick={
                  header.column.getCanSort()
                    ? header.column.getToggleSortingHandler()
                    : undefined
                }
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </div>
            )),
          )}
        </TableHeader>

        {table.getRowModel().rows.map((row, idx) => (
          <TableRow
            key={row.id}
            sx={{
              borderBottom:
                data.length - 1 !== idx ? "1px solid #e0e0e0" : "none",
            }}
          >
            {row.getVisibleCells().map((cell) => (
              <div key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </TableRow>
        ))}
      </LogTable>
    </Wrapper>
  );
}

// Styled
const Wrapper = styled(Box)({
  gap: "40px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  borderRadius: "12px",
  flexDirection: "column",
  justifyContent: "center",
  //   padding: "32px 28px 64px",
  backgroundColor: "#fff",
});

const TopPanel = styled(Box)({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const Title = styled(Box)({
  fontSize: 20,
  width: "100%",
  fontWeight: 600,
  display: "flex",
  color: "#747D8A",
  justifyContent: "start",
});

const TableHeader = styled(Box)({
  top: 0,
  zIndex: 10,
  gap: "32px",
  width: "100%",
  display: "flex",
  position: "sticky",
  padding: "12px 16px",
  alignItems: "center",
  backgroundColor: "#F1F2F3",
  borderRadius: "10px 10px 0 0",
});

const LogTable = styled(Box)({
  width: "100%",
  height: "100%",
  overflowY: "auto",
  maxHeight: "400px",
  borderRadius: "10px",
  position: "relative",
  backgroundColor: "#fff",
  border: "1px solid #e0e0e0",
});

const TableRow = styled(Box)({
  gap: "32px",
  width: "100%",
  display: "flex",
  padding: "10px 16px",
  alignItems: "center",
  backgroundColor: "#fff",
});

// Header
const HeaderCenter = styled(Box)<{ width?: string }>(({ width }) => ({
  fontSize: 16,
  fontWeight: 400,
  color: "#747D8A",
  overflow: "hidden",
  textAlign: "center",
  whiteSpace: "nowrap",
  width: width ?? "auto",
  textOverflow: "ellipsis",
  flex: width ? `0 0 ${width}` : "1 1 auto",
}));

const HeaderStart = styled(Box)({
  flex: 1,
  fontSize: 16,
  fontWeight: 400,
  color: "#747D8A",
  textAlign: "start",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

// Cell
const CellCenter = styled(Box)<{ width?: string }>(({ width }) => ({
  fontSize: 16,
  fontWeight: 400,
  display: "flex",
  color: "#464B53",
  overflow: "hidden",
  textAlign: "center",
  alignItems: "center",
  whiteSpace: "nowrap",
  width: width ?? "auto",
  justifyContent: "center",
  textOverflow: "ellipsis",
  flex: width ? `0 0 ${width}` : "1 1 auto",
}));

const CellStart = styled(Box)({
  flex: 1,
  fontSize: 16,
  fontWeight: 400,
  color: "#464B53",
  textAlign: "start",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

// Badge
const StatusBadge = styled(Box)<{ status: string }>(({ status }) => ({
  fontSize: 12,
  width: "100%",
  padding: "4px",
  fontWeight: 600,
  color: "#fff",
  maxWidth: "40px",
  textAlign: "center",
  borderRadius: "100px",
  backgroundColor: status === "Ok" ? "#32C794" : "#F44336",
}));
