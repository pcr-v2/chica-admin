"use client";

import { Box, styled } from "@mui/material";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import Badge from "@/app/_components/common/Badge";
import ContentsPagination from "@/app/_components/common/ContentsPagination";
import ContentsViewCountFilter from "@/app/_components/common/ContentsViewCountFilter";
import { GetCsListResponse } from "@/app/actions/cs/getCsListAction";
import EditIcon from "@/public/images/icons/edit-icon.svg";

interface IProps {
  onClickTitle: (boardId: number) => void;
  onClickEdit: (boardId: number) => void;
  list: GetCsListResponse["result"];
}

export default function CsTable({ list, onClickEdit, onClickTitle }: IProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const data = useMemo(() => list ?? [], [list]);

  const columns = useMemo<ColumnDef<NonNullable<IProps["list"]>[0]>[]>(
    () => [
      {
        header: "No",
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "제목",
        accessorKey: "title",
        cell: (info) => (
          <Ellipsis
            title={info.getValue() as string}
            onClick={() => onClickTitle(info.row.original.id)}
            style={{ cursor: "pointer" }}
          >
            {info.getValue() as string}
          </Ellipsis>
        ),
      },
      {
        header: "학교",
        accessorFn: (row) => row.school.schoolName,
      },
      {
        header: "작성일",
        accessorFn: (row) => dayjs(row.createdAt).format("YYYY-MM-DD"),
      },
      {
        header: "답변상태",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <Box display="flex" justifyContent="center">
              {status === "UNANSWERED" ? (
                <Badge label="미완료" status={status} />
              ) : status === "ANSWERED" ? (
                <Badge label="답변완료" status={status} />
              ) : (
                "삭제"
              )}
            </Box>
          );
        },
      },
      {
        header: "수정",
        accessorKey: "update",
        cell: ({ row }) => {
          return (
            <div
              style={{ display: "flex", justifyContent: "center" }}
              onClick={() => onClickEdit(row.original.id)}
            >
              <Edit />
            </div>
          );
        },
      },
    ],
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater({ pageIndex, pageSize });
        setPageIndex(next.pageIndex);
        setPageSize(next.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: false,
  });

  return (
    <Wrapper>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <TableHeaderColumn
              key={header.id}
              onClick={
                header.column.getCanSort()
                  ? header.column.getToggleSortingHandler()
                  : undefined
              }
              style={{
                cursor:
                  // header.column.getCanSort() ? "pointer" :
                  "default",
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {/* {{
                asc: " 🔼",
                desc: " 🔽",
              }[header.column.getIsSorted() as string] ?? null} */}
            </TableHeaderColumn>
          )),
        )}
      </TableHeader>

      {table.getRowModel().rows.map((row, i) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableRowItem key={cell.id}>
              {cell.column.id === "No"
                ? i + 1 // ✅ 현재 페이지 내 순서
                : flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableRowItem>
          ))}
        </TableRow>
      ))}

      <PaginationBar>
        <ContentsPagination
          isEmpty={(list?.length ?? 0) <= 1}
          totalPages={table.getPageCount()}
          currentPage={pageIndex}
          onPageChange={(page) => setPageIndex(page)}
          onClickFirst={() => setPageIndex(0)}
          onClickPrev={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          onClickNext={() =>
            setPageIndex((prev) => Math.min(prev + 1, table.getPageCount() - 1))
          }
          onClickLast={() => setPageIndex(table.getPageCount() - 1)}
          disableFirst={!table.getCanPreviousPage()}
          disablePrev={!table.getCanPreviousPage()}
          disableNext={!table.getCanNextPage()}
          disableLast={!table.getCanNextPage()}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            // width: "100%",
            minWidth: "145px",
          }}
        >
          <span
            style={{
              color: "#747D8A",
              fontSize: 14,
              fontWeight: 400,
              // whiteSpace: "nowrap",
            }}
          >
            표시열 개수
          </span>
          <ContentsViewCountFilter
            selectedCount={pageSize}
            onChange={(size) => {
              setPageSize(size);
              setPageIndex(0); // 처음 페이지로
            }}
            options={[10, 30, 100]}
          />
        </Box>
      </PaginationBar>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
}));

const TableHeader = styled(Box)(() => ({
  gap: "40px",
  width: "100%",
  display: "flex",
  padding: "12px 16px",
  alignItems: "center",
  backgroundColor: "#F7F8FA",
  justifyContent: "start",
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

const Ellipsis = styled(Box)(() => ({
  width: "100%",
  maxWidth: "903px",
  display: "block",
  overflow: "hidden",
  whiteSpace: "nowrap",
  justifyContent: "start",
  textOverflow: "ellipsis",
}));

const PaginationBar = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "24px 0px 32px",
  };
});

const Edit = styled(EditIcon)(() => ({
  width: "30px",
  height: "30px",
  cursor: "pointer",
  path: {
    fill: "#747D8A",
  },
}));
