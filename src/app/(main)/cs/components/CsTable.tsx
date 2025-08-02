"use client";

import { Box, styled } from "@mui/material";
import dayjs from "dayjs";

import Badge from "@/app/_components/common/Badge";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { GetCsListResponse } from "@/app/actions/cs/getCsListAction";

interface IProps {
  list: GetCsListResponse["result"];
}

export default function CsTable(props: IProps) {
  const { list } = props;

  return (
    <Wrapper>
      <TableHeader>
        <TableHeaderColumn
          style={{
            minWidth: "42px",
            justifyContent: "center",
          }}
        >
          No
        </TableHeaderColumn>
        <TableHeaderColumn style={{ width: "100%", maxWidth: "903px" }}>
          제목
        </TableHeaderColumn>
        <TableHeaderColumn style={{ minWidth: "180px", maxWidth: "180px" }}>
          학교
        </TableHeaderColumn>
        <TableHeaderColumn style={{ minWidth: "110px", maxWidth: "110px" }}>
          작성일
        </TableHeaderColumn>
        <TableHeaderColumn
          style={{
            minWidth: "80px",
            maxWidth: "80px",
            justifyContent: "center",
          }}
        >
          답변상태
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
              {idx + 1}
            </TableRowItem>

            <TableRowItem
              title={el.title}
              style={{
                width: "100%",
                maxWidth: "903px",
                justifyContent: "start",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {el.title}
            </TableRowItem>
            <TableRowItem style={{ minWidth: "180px", maxWidth: "180px" }}>
              {el.school.schoolName}
            </TableRowItem>
            <TableRowItem style={{ minWidth: "110px", maxWidth: "110px" }}>
              {dayjs(el.createdAt).format("YYYY-MM-DD")}
            </TableRowItem>
            <TableRowItem
              style={{
                minWidth: "80px",
                maxWidth: "80px",
                justifyContent: "center",
              }}
            >
              {el.status === "UNANSWERED" ? (
                <Badge label="미완료" status={el.status} />
              ) : el.status === "ANSWERED" ? (
                <Badge label="답변완료" status={el.status} />
              ) : (
                "삭제"
              )}
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
    height: "80px",
    // width: "100%",
    display: "flex",
    padding: "0px 16px",
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
