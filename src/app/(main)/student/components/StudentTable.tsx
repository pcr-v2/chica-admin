"use client";

import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Toggle } from "@/app/_components/common/Toggle";
import { GetStudentListResponse } from "@/app/actions/student/getStudentListAction";
import { updateStudentStatus } from "@/app/actions/student/updateStudentStatus";
import FemaleIcon from "@/public/images/icons/female-icon.svg";
import MaleIcon from "@/public/images/icons/male-icon.svg";

interface IProps {
  list: GetStudentListResponse["result"];
}

export default function StudentTable(props: IProps) {
  const { list } = props;

  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialMap: Record<string, boolean> = {};
    list?.forEach((el) => {
      initialMap[el.studentId] = el.studentStatus;
    });
    setStatusMap(initialMap);
  }, [list]);

  const handleToggle = async (studentId: string, newStatus: boolean) => {
    // optimistic UI 업데이트
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: newStatus,
    }));

    // TODO: 실제 API 호출
    try {
      const res = await updateStudentStatus({
        studentId,
        studentStatus: newStatus,
      });

      if (res.code === "FAIL") {
        toast.error(res.message);
      }

      toast.success(
        `${res.result?.school.schoolName} ${res.result?.studentName}학생 상태를 변경했습니다.`,
      );
    } catch (err) {
      // 실패 시 롤백
      setStatusMap((prev) => ({
        ...prev,
        [studentId]: !newStatus,
      }));
      console.error("변경 실패", err);
    }
  };

  return (
    <Wrapper>
      <TableHeader>
        <TableHeaderColumn
          style={{
            minWidth: "42px",
            justifyContent: "center",
          }}
        >
          성별
        </TableHeaderColumn>
        <TableHeaderColumn style={{ width: "100%", maxWidth: "280px" }}>
          학교
        </TableHeaderColumn>
        <TableHeaderColumn style={{ minWidth: "160px", maxWidth: "160px" }}>
          학년
        </TableHeaderColumn>
        <TableHeaderColumn style={{ minWidth: "160px", maxWidth: "160px" }}>
          반
        </TableHeaderColumn>
        <TableHeaderColumn
          style={{
            minWidth: "160px",
            maxWidth: "160px",
          }}
        >
          번호
        </TableHeaderColumn>
        <TableHeaderColumn
          style={{
            minWidth: "160px",
            maxWidth: "160px",
          }}
        >
          이름
        </TableHeaderColumn>
        <TableHeaderColumn
          style={{
            minWidth: "160px",
            maxWidth: "160px",
          }}
        >
          재학여부
        </TableHeaderColumn>
      </TableHeader>

      {list?.map((el, idx) => {
        return (
          <TableRow key={idx}>
            <TableRowItem
              style={{
                width: "42px",
                minWidth: "42px",
                justifyContent: "center",
              }}
            >
              {el.studentGender === "male" ? <Male /> : <Female />}
            </TableRowItem>

            <TableRowItem
              title={el.school.schoolName}
              style={{
                width: "100%",
                maxWidth: "280px",
                justifyContent: "start",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {el.school.schoolName}
            </TableRowItem>
            <TableRowItem style={{ minWidth: "160px", maxWidth: "160px" }}>
              {el.studentGrade}학년
            </TableRowItem>
            <TableRowItem style={{ minWidth: "160px", maxWidth: "160px" }}>
              {el.studentClass}반
            </TableRowItem>
            <TableRowItem style={{ minWidth: "160px", maxWidth: "160px" }}>
              {el.studentNumber}번
            </TableRowItem>
            <TableRowItem style={{ minWidth: "160px", maxWidth: "160px" }}>
              {el.studentName}
            </TableRowItem>
            <TableRowItem style={{ minWidth: "160px", maxWidth: "160px" }}>
              <Toggle
                label=""
                checked={
                  statusMap[el.studentId] !== undefined
                    ? statusMap[el.studentId]
                    : el.studentStatus
                }
                onChange={(checked) => handleToggle(el.studentId, checked)}
              />
            </TableRowItem>
          </TableRow>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    maxHeight: "580px",
    overflowY: "auto",
    flexDirection: "column",
  };
});

const TableHeader = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    padding: "12px 16px",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    justifyContent: "start",
    borderRadius: "10px 10px 0px 0px",
  };
});

const TableHeaderColumn = styled(Box)(() => {
  return {
    fontSize: 16,
    // width: "90px",
    fontWeight: 400,
    color: "#747D8A",
    textAlign: "start",
    justifyContent: "start",
    display: "flex",
  };
});

const TableRow = styled(Box)(() => {
  return {
    gap: "40px",
    height: "82px",
    // width: "100%",
    display: "flex",
    padding: "20px 16px",
    alignItems: "center",
    backgroundColor: "#fff",
    // justifyContent: "center",
    borderBottom: "1px solid #F3F3F3",
  };
});

const TableRowItem = styled(Box)(() => {
  return {
    fontSize: 18,
    display: "flex",
    fontWeight: 400,
    color: "#080808",
    alignItems: "center",
  };
});

const Male = styled(MaleIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "42px",
  height: "42px",
}));

const Female = styled(FemaleIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "42px",
  height: "42px",
}));
