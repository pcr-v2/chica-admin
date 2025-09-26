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
              {flexRender(header.column.columnDef.header, header.getContext())}
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
    </LogTable>
  );
}

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

const TableRow = styled(Box)({
  gap: "32px",
  width: "100%",
  display: "flex",
  padding: "10px 16px",
  alignItems: "center",
  backgroundColor: "#fff",
});
