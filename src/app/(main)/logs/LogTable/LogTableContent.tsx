"use client";

import { Box, styled } from "@mui/material";
import { flexRender, Table } from "@tanstack/react-table";

import { LogRow } from "@/app/(main)/logs/LogTable/useLogTable";

interface IProps {
  table: Table<LogRow>;
  totalData: number;
}
export default function LogTableContent(props: IProps) {
  const { table, totalData } = props;

  return (
    <LogTable>
      <TableInner>
        <TableHeader>
          {table
            .getHeaderGroups()
            .map((group) =>
              group.headers.map((header) => (
                <div key={header.id}>
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
              borderBottom: totalData !== idx ? "1px solid #e0e0e0" : "none",
            }}
          >
            {row.getVisibleCells().map((cell) => (
              <div key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </TableRow>
        ))}
      </TableInner>
    </LogTable>
  );
}

const LogTable = styled(Box)(({ theme }) => {
  return {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    maxHeight: "400px",
    borderRadius: "10px",
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    [theme.breakpoints.down("desktop")]: {
      overflowX: "auto",
      overscrollBehavior: "none",
    },
  };
});

const TableInner = styled(Box)(() => ({
  display: "inline-block", // content width에 맞게
  minWidth: "100%", // 최소 폭은 부모 Table과 동일
}));

const TableHeader = styled(Box)(({ theme }) => {
  return {
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
    [theme.breakpoints.down("desktop")]: {
      gap: "16px",
      padding: "8px 10px",
      minWidth: "max-content",
    },
  };
});

const TableRow = styled(Box)(({ theme }) => {
  return {
    gap: "32px",
    width: "100%",
    display: "flex",
    padding: "10px 16px",
    alignItems: "center",
    backgroundColor: "#fff",
    [theme.breakpoints.down("desktop")]: {
      gap: "16px",
      padding: "8px 10px",
      minWidth: "max-content",
    },
  };
});
