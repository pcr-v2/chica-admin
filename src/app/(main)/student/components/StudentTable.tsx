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
import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";

import ContentsPagination from "@/app/_components/common/ContentsPagination";
import ContentsViewCountFilter from "@/app/_components/common/ContentsViewCountFilter";
import { Toggle } from "@/app/_components/common/Toggle";
import { GetStudentListResponse } from "@/app/actions/student/getStudentListAction";
import { updateStudentStatus } from "@/app/actions/student/updateStudentStatus";
import EditIcon from "@/public/images/icons/edit-icon.svg";
import FemaleIcon from "@/public/images/icons/female-icon.svg";
import MaleIcon from "@/public/images/icons/male-icon.svg";
import RankIcon from "@/public/images/icons/rank-icon.svg";

type Student = NonNullable<GetStudentListResponse["result"]>[0];

interface IProps {
  onClickEdit: (studentId: string) => void;
  list: GetStudentListResponse["result"];
}

export default function StudentTable({ list, onClickEdit }: IProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});

  const data = useMemo(() => list ?? [], [list]);

  useEffect(() => {
    const initialStatus = data.reduce(
      (acc, cur) => {
        acc[cur.studentId] = cur.studentStatus;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setStatusMap(initialStatus);
  }, [data]);

  const handleToggle = async (studentId: string, newStatus: boolean) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: newStatus }));

    try {
      const res = await updateStudentStatus({
        studentId,
        studentStatus: newStatus,
      });

      if (res.code === "FAIL") {
        toast.error(res.message);
        setStatusMap((prev) => ({ ...prev, [studentId]: !newStatus }));
        return;
      }

      toast.success(
        `${res.result?.school.schoolName} ${res.result?.studentName} 학생 상태 변경 완료`,
      );
    } catch (e) {
      toast.error("상태 변경 실패");
      setStatusMap((prev) => ({ ...prev, [studentId]: !newStatus }));
    }
  };

  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        header: "성별",
        accessorKey: "studentGender",
        cell: ({ getValue }) => (getValue() === "male" ? <Male /> : <Female />),
      },
      {
        header: "학교",
        accessorFn: (row) => row.school.schoolName,
        cell: ({ getValue }) => (
          <Ellipsis title={getValue() as string}>{String(getValue())}</Ellipsis>
        ),
      },
      {
        header: "학년",
        accessorKey: "studentGrade",
        cell: ({ getValue }) => `${getValue()}학년`,
      },
      {
        header: "반",
        accessorKey: "studentClass",
        cell: ({ getValue }) => `${getValue()}반`,
      },
      {
        header: "번호",
        accessorKey: "studentNumber",
        cell: ({ getValue }) => `${getValue()}번`,
      },
      {
        header: "이름",
        accessorKey: "studentName",
      },
      // {
      //   header: "재학여부",
      //   accessorKey: "studentStatus",
      //   cell: ({ row }) => {
      //     const studentId = row.original.studentId;
      //     const checked = statusMap[studentId];

      //     return (
      //       <Toggle
      //         label=""
      //         checked={checked}
      //         onChange={(val) => handleToggle(studentId, val)}
      //       />
      //     );
      //   },
      // },
      {
        header: "",
        accessorKey: "update",
        cell: ({ row }) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <Edit
                onClick={() => {
                  onClickEdit(row.original.studentId);
                }}
              />
              <Rank
                onClick={() => {
                  alert("랭킹");
                }}
              />
            </div>
          );
        },
      },
    ],
    [statusMap],
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
        {table.getHeaderGroups().map((group) =>
          group.headers.map((header) => (
            <TableHeaderColumn
              key={header.id}
              onClick={
                header.column.getCanSort()
                  ? header.column.getToggleSortingHandler()
                  : undefined
              }
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHeaderColumn>
          )),
        )}
      </TableHeader>

      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableRowItem key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableRowItem>
          ))}
        </TableRow>
      ))}

      <PaginationBar>
        <ContentsPagination
          isEmpty={data.length <= 1}
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
            gap: "8px",
            display: "flex",
            minWidth: "145px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "#747D8A",
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
  display: "block",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}));

const PaginationBar = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "24px 0px 32px",
}));

const Male = styled(MaleIcon)(() => ({
  width: "42px",
  height: "42px",
}));

const Female = styled(FemaleIcon)(() => ({
  width: "42px",
  height: "42px",
}));

const Edit = styled(EditIcon)(() => ({
  width: "30px",
  height: "30px",
  cursor: "pointer",
  path: {
    fill: "#747D8A",
  },
}));

const Rank = styled(RankIcon)(() => ({
  width: "40px",
  height: "40px",
  cursor: "pointer",
  path: {
    fill: "#747D8A",
  },
}));
