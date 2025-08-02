"use client";

import { Box, styled } from "@mui/material";
import dayjs from "dayjs";

import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import EditIcon from "@/public/images/icons/edit-icon.svg";

interface IProps {
  list: GetSchoolListResponse["result"];
}

export default function SchoolTable(props: IProps) {
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

        <TableHeaderColumn style={{ width: "100%", maxWidth: "280px" }}>
          학교
        </TableHeaderColumn>

        <TableHeaderColumn style={{ width: "100%", maxWidth: "160px" }}>
          담당자
        </TableHeaderColumn>

        <TableHeaderColumn style={{ width: "100%", maxWidth: "280px" }}>
          이메일
        </TableHeaderColumn>

        <TableHeaderColumn style={{ width: "100%", maxWidth: "180px" }}>
          사용기한
        </TableHeaderColumn>
      </TableHeader>

      {list?.map((el, idx) => {
        return (
          <RowWrap key={idx}>
            <TableRow>
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
                title={el.schoolName}
                style={{
                  width: "100%",
                  maxWidth: "280px",
                  display: "block",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  justifyContent: "start",
                  textOverflow: "ellipsis",
                }}
              >
                {el.schoolName}
              </TableRowItem>

              <TableRowItem style={{ width: "100%", maxWidth: "160px" }}>
                {el.teacherName}
              </TableRowItem>

              <TableRowItem style={{ width: "100%", maxWidth: "280px" }}>
                {el.teacherEmail}
              </TableRowItem>

              <TableRowItem style={{ width: "100%", maxWidth: "180px" }}>
                {dayjs(el.startAt).format("YYYY.MM.DD")}

                <span style={{ margin: "0px 12px" }}>~</span>

                {dayjs(el.endAt).format("YYYY.MM.DD")}
              </TableRowItem>
            </TableRow>

            <Edit />
          </RowWrap>
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
    justifyContent: "start",
    backgroundColor: "#F7F8FA",
    borderRadius: "10px 10px 0px 0px",
  };
});

const TableHeaderColumn = styled(Box)(() => {
  return {
    fontSize: 16,
    fontWeight: 400,
    display: "flex",
    color: "#747D8A",
    textAlign: "start",
    justifyContent: "start",
  };
});

const RowWrap = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

const TableRow = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    height: "80px",
    display: "flex",
    padding: "0px 16px",
    alignItems: "center",
    backgroundColor: "#fff",
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

const Edit = styled(EditIcon)(() => ({
  width: "40px",
  height: "40px",
  cursor: "pointer",
  margin: "6px 20px 0px 0px",
  path: {
    fill: "#747D8A",
  },
}));
