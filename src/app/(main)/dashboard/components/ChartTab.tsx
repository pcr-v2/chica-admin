"use client";

import { Box, styled } from "@mui/material";

interface IProps {
  tab: "day" | "week";
  onClick: (tab: "day" | "week") => void;
}

export default function ChartTab(props: IProps) {
  const { tab, onClick } = props;

  return (
    <SelectWrap>
      <SingleTab
        onClick={() => onClick("day")}
        isactive={(tab === "day").toString()}
      >
        <span>일간</span>
      </SingleTab>

      <MultiTab
        onClick={() => onClick("week")}
        isactive={(tab === "week").toString()}
      >
        <span>주간</span>
      </MultiTab>
    </SelectWrap>
  );
}

const SelectWrap = styled(Box)(() => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

const SingleTab = styled(Box)<{ isactive: string }>(({ isactive, theme }) => {
  return {
    gap: "6px",
    fontSize: 16,
    display: "flex",
    cursor: "pointer",
    lineHeight: "150%",
    padding: "8px 12px",
    borderTop: "1px solid",
    borderLeft: "1px solid",
    letterSpacing: "-0.42px",
    justifyContent: "center",
    borderColor: "#32C794",
    borderBottom: "1px solid",
    backdropFilter: "blur(4px)",
    borderRadius: "8px 0px 0px 8px",
    transition: "all 0.3s ease-in-out",
    fontWeight: isactive === "true" ? 700 : 500,
    color: isactive === "true" ? "#32C794" : "#747d8a",
    backgroundColor: isactive === "true" ? "#EDFCF7" : "#fff",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 14,
      padding: "4px 8px",
    },
  };
});

const MultiTab = styled(Box)<{ isactive: string }>(({ isactive, theme }) => {
  return {
    gap: "6px",
    fontSize: 16,
    display: "flex",
    cursor: "pointer",
    lineHeight: "150%",
    padding: "8px 12px",
    borderTop: "1px solid",
    letterSpacing: "-0.42px",
    justifyContent: "center",
    borderRight: "1px solid",
    borderColor: "#32C794",
    borderBottom: "1px solid",
    backdropFilter: "blur(4px)",
    borderRadius: "0px 8px 8px 0px",
    transition: "all 0.3s ease-in-out",
    fontWeight: isactive === "true" ? 700 : 500,
    color: isactive === "true" ? "#32C794" : "#747d8a",
    backgroundColor: isactive === "true" ? "#EDFCF7" : "#fff",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 14,
      padding: "4px 8px",
    },
  };
});
