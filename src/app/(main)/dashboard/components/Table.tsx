"use client";

import { Box, styled } from "@mui/material";

import Female from "@/public/images/icons/female-icon.svg";
import Male from "@/public/images/icons/male-icon.svg";

const testList = [
  { gender: "male", grade: 4, class: "12", number: 1, name: "정소민" },
  { gender: "female", grade: 4, class: "12", number: 1, name: "정소민" },
  { gender: "male", grade: 4, class: "12", number: 1, name: "정소민" },
  { gender: "female", grade: 4, class: "12", number: 1, name: "정소민" },
  { gender: "male", grade: 4, class: "12", number: 1, name: "정소민" },
  { gender: "female", grade: 4, class: "12", number: 1, name: "정소민" },
  { gender: "female", grade: 4, class: "12", number: 1, name: "정소민" },
  { gender: "female", grade: 4, class: "12", number: 1, name: "정소민" },
];

export default function Table() {
  return (
    <Wrapper>
      <TableHeader>
        <TableHeaderColumn>성별</TableHeaderColumn>
        <TableHeaderColumn>학년</TableHeaderColumn>
        <TableHeaderColumn>반</TableHeaderColumn>
        <TableHeaderColumn>번호</TableHeaderColumn>
        <TableHeaderColumn>이름</TableHeaderColumn>
      </TableHeader>

      {testList.map((el, idx) => {
        return (
          <TableRow
            key={idx}
            style={{
              borderBottom:
                testList.length - 1 === idx ? "none" : "1px solid #F3F3F3",
            }}
          >
            <TableRowItem>
              <Icon>{el.gender === "male" ? <Male /> : <Female />}</Icon>
            </TableRowItem>

            <TableRowItem>{el.grade}학년</TableRowItem>
            <TableRowItem>{el.class}반</TableRowItem>
            <TableRowItem>{el.number}번</TableRowItem>
            <TableRowItem>{el.name}</TableRowItem>
          </TableRow>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    maxHeight: "320px",
    borderRadius: "10px",
    backgroundColor: "#fff",
  };
});

const TableHeader = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    padding: "12px 16px",
    alignItems: "center",
    backgroundColor: "#F1F2F3",
    justifyContent: "space-between",
    borderRadius: "10px 10px 0px 0px",
  };
});

const TableHeaderColumn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "90px",
    fontWeight: 400,
    color: "#747D8A",
    textAlign: "start",
  };
});

const TableRow = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    padding: "10px 16px",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    borderRadius: "10px 10px 0px 0px",
  };
});

const TableRowItem = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "90px",
    fontWeight: 400,
    display: "flex",
    color: "#464B53",
    textAlign: "start",
    alignItems: "center",
  };
});

const Icon = styled(Box)({
  width: 42,
  height: 42,
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "center",

  svg: {
    // width: "100%",
    // height: "100%",
  },
});
