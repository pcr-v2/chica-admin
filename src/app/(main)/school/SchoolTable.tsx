"use client";

import { Box, styled } from "@mui/material";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import ContentsPagination from "@/app/_components/common/ContentsPagination";
import ContentsViewCountFilter from "@/app/_components/common/ContentsViewCountFilter";
import { Toggle } from "@/app/_components/common/Toggle";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import { UpdateSchoolStatus } from "@/app/actions/school/updateSchoolStatusAction";
import EditIcon from "@/public/images/icons/edit-icon.svg";

interface IProps {
  statusMap: Record<string, boolean>;
  handleToggle: (schoolId: string, val: boolean) => void;
  onClickEdit: (schoolId: string) => void;
  list: GetSchoolListResponse["result"];
}

export default function SchoolTable({
  list,
  statusMap,
  onClickEdit,
  handleToggle,
}: IProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const data = useMemo(() => list ?? [], [list, statusMap]);

  const columns = useMemo<ColumnDef<NonNullable<IProps["list"]>[0]>[]>(
    () => [
      {
        header: "No",
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "학교",
        accessorKey: "schoolName",
        cell: (info) => (
          <Ellipsis title={info.getValue() as string}>
            {info.getValue() as string}
          </Ellipsis>
        ),
      },
      {
        header: "담당자",
        accessorKey: "teacherName",
      },
      {
        header: "이메일",
        accessorKey: "teacherEmail",
      },
      {
        header: "사용기한",
        accessorFn: (row) =>
          `${dayjs(row.startAt).format("YYYY.MM.DD")} ~ ${dayjs(row.endAt).format("YYYY.MM.DD")}`,
      },
      {
        header: "학교상태",
        accessorKey: "studentStatus",
        cell: ({ row }) => {
          const schoolId = row.original.schoolId;
          const checked = statusMap[schoolId];

          return (
            <Toggle
              label=""
              checked={checked}
              onChange={(val) => handleToggle(schoolId, val)}
            />
          );
        },
      },
      {
        header: "수정",
        id: "edit",
        cell: ({ row }) => (
          <EditBox onClick={() => onClickEdit(row.original.schoolId)}>
            <EditIconStyled />
          </EditBox>
        ),
      },
    ],
    [onClickEdit],
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
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
              style={{ cursor: "default" }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHeaderColumn>
          )),
        )}
      </TableHeader>

      {table.getRowModel().rows.map((row, i) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableRowItem key={cell.id}>
              {cell.column.id === "No"
                ? i + 1
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
            minWidth: "145px",
          }}
        >
          <span style={{ color: "#747D8A", fontSize: 14, fontWeight: 400 }}>
            표시열 개수
          </span>
          <ContentsViewCountFilter
            selectedCount={pageSize}
            onChange={(size) => {
              setPageSize(size);
              setPageIndex(0);
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

const PaginationBar = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "24px 0px 32px",
}));

const EditBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  cursor: "pointer",
}));

const EditIconStyled = styled(EditIcon)(() => ({
  width: "30px",
  height: "30px",
  path: {
    fill: "#747D8A",
  },
}));
