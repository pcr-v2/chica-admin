"use client";

import { Box, styled } from "@mui/material";

import Table from "@/app/(main)/dashboard/_components/Table";

export default function BottomContent() {
  return (
    <Wrapper>
      <TableWrap>
        <Title>미참여 학생 리스트</Title>

        <Table />
      </TableWrap>

      <TableWrap>
        <Title>학생 순위</Title>

        <Table />
      </TableWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
  };
});

const TableWrap = styled(Box)(() => {
  return {
    gap: "24px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const Title = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    fontWeight: 600,
    color: "#464B53",
    textAlign: "start",
  };
});
