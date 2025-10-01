"use client";

import { Box, styled } from "@mui/material";

import { GetUnCheckedStatisticResponse } from "@/app/actions/statistic/getUnCheckedStatistic";
import Female from "@/public/images/icons/female-icon.svg";
import Male from "@/public/images/icons/male-icon.svg";

interface IProps {
  unCheckedList: GetUnCheckedStatisticResponse;
}

export default function UnCheckedTable(props: IProps) {
  const { unCheckedList } = props;

  return (
    <Wrapper>
      <TableHeader>
        <TableHeaderColumn>성별</TableHeaderColumn>
        <TableHeaderColumn>학년</TableHeaderColumn>
        <TableHeaderColumn>반</TableHeaderColumn>
        <TableHeaderColumn>번호</TableHeaderColumn>
        <TableHeaderColumn>이름</TableHeaderColumn>
      </TableHeader>

      {unCheckedList.data?.map((el, idx) => {
        return (
          <TableRow
            key={idx}
            style={{
              borderBottom:
                unCheckedList.data && unCheckedList.data?.length - 1 === idx
                  ? "none"
                  : "1px solid #F3F3F3",
            }}
          >
            <TableRowItem>
              {el.student_gender === "male" ? <MaleIcon /> : <FeMaleIcon />}
            </TableRowItem>

            <TableRowItem>{el.student_grade}학년</TableRowItem>
            <TableRowItem>{el.student_class}반</TableRowItem>
            <TableRowItem>{el.student_number}번</TableRowItem>
            <TableRowItem>{el.student_name}</TableRowItem>
          </TableRow>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled(Box)(({ theme }) => {
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

const TableHeader = styled(Box)(({ theme }) => {
  return {
    top: 0,
    zIndex: 10,
    width: "100%",
    display: "flex",
    position: "sticky",
    padding: "12px 16px",
    alignItems: "center",
    backgroundColor: "#F1F2F3",
    justifyContent: "space-around",
    borderRadius: "10px 10px 0px 0px",
    [theme.breakpoints.down("desktop")]: {
      padding: "8px 10px",
      minWidth: "max-content",
    },
  };
});

const TableHeaderColumn = styled(Box)(({ theme }) => {
  return {
    fontSize: 16,
    width: "48px",
    fontWeight: 400,
    color: "#747D8A",
    textAlign: "center",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 14,
    },
  };
});

const TableRow = styled(Box)(({ theme }) => {
  return {
    width: "100%",
    display: "flex",
    padding: "10px 16px",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    borderRadius: "10px 10px 0px 0px",
    [theme.breakpoints.down("desktop")]: {
      padding: "8px 10px",
      minWidth: "max-content",
    },
  };
});

const TableRowItem = styled(Box)(({ theme }) => {
  return {
    fontSize: 16,
    width: "48px",
    fontWeight: 400,
    display: "flex",
    color: "#464B53",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 14,
    },
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

const MaleIcon = styled(Male)<{ isopen: string }>(({ isopen, theme }) => ({
  width: "42px",
  height: "42px",
  [theme.breakpoints.down("desktop")]: {
    width: "24px",
    height: "24px",
  },
}));

const FeMaleIcon = styled(Female)<{ isopen: string }>(({ isopen, theme }) => ({
  width: "42px",
  height: "42px",
  [theme.breakpoints.down("desktop")]: {
    width: "24px",
    height: "24px",
  },
}));
