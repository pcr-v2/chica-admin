"use client";

import { Box, styled } from "@mui/material";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo } from "react";

export type LogRow = {
  id: number;
  schoolId: string | null;
  createdAt: Date;
  school: { schoolName: string } | null;
  content: string | null;
  logsStatus: "Ok" | "No" | "Del" | null;
  count: number | null;
  grade: string | null;
  reason: string | null;
};

export default function useLogTable(data: LogRow[]) {
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
        cell: ({ row }) => {
          const content = row.original.content ?? "";

          // "생성"과 "삭제"를 <span>으로 감싸서 색상 적용
          const formatted = content.split(/(생성|삭제)/g).map((part, idx) => {
            if (part === "생성")
              return (
                <span key={idx} style={{ color: "#32C794", fontWeight: 700 }}>
                  {part}
                </span>
              );
            if (part === "삭제")
              return (
                <span key={idx} style={{ color: "#F44336", fontWeight: 700 }}>
                  {part}
                </span>
              );
            return part;
          });

          return <CellStart>{formatted}</CellStart>;
        },
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

  return { columns, table };
}

// Header
const HeaderCenter = styled(Box)<{ width?: string }>(({ width, theme }) => ({
  fontSize: 16,
  fontWeight: 400,
  color: "#747D8A",
  overflow: "hidden",
  textAlign: "center",
  whiteSpace: "nowrap",
  width: width ?? "auto",
  textOverflow: "ellipsis",
  flex: width ? `0 0 ${width}` : "1 1 auto",
  [theme.breakpoints.down("desktop")]: {
    fontSize: 14,
  },
}));

const HeaderStart = styled(Box)(({ theme }) => {
  return {
    flex: 1,
    fontSize: 16,
    fontWeight: 400,
    color: "#747D8A",
    textAlign: "start",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 14,
    },
  };
});

// Cell
const CellCenter = styled(Box)<{ width?: string }>(({ width, theme }) => ({
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
  [theme.breakpoints.down("desktop")]: {
    fontSize: 14,
  },
}));

const CellStart = styled(Box)(({ theme }) => {
  return {
    flex: 1,
    fontSize: 16,
    fontWeight: 400,
    color: "#464B53",
    textAlign: "start",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 14,
    },
  };
});

const StatusBadge = styled(Box)<{ status: string }>(({ status, theme }) => ({
  fontSize: 12,
  width: "100%",
  padding: "4px",
  fontWeight: 600,
  color: "#fff",
  maxWidth: "40px",
  textAlign: "center",
  borderRadius: "100px",
  backgroundColor:
    status === "Ok"
      ? "#32C794"
      : status === "Del"
        ? "#FFA726" // Del일 경우 노란색
        : "#F44336", // No일 경우 빨간색

  [theme.breakpoints.down("desktop")]: {
    fontSize: 10,
  },
}));
