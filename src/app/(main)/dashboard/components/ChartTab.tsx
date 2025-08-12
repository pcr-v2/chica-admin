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

const SingleTab = styled(Box)<{ isactive: string }>(({ isactive }) => {
  return {
    gap: "6px",
    fontSize: 16,
    fontWeight: isactive === "true" ? 700 : 500,
    display: "flex",
    cursor: "pointer",
    lineHeight: "150%",
    padding: "8px 12px",
    borderTop: "1px solid",
    borderLeft: "1px solid",
    letterSpacing: "-0.42px",
    justifyContent: "center",
    borderBottom: "1px solid",
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease-in-out",
    borderRadius: "8px 0px 0px 8px",
    color: isactive === "true" ? "#32C794" : "#747d8a",
    borderColor: "#32C794",
    backgroundColor: isactive === "true" ? "#EDFCF7" : "#fff",
  };
});

const MultiTab = styled(Box)<{ isactive: string }>(({ isactive }) => {
  return {
    gap: "6px",
    fontSize: 16,
    fontWeight: isactive === "true" ? 700 : 500,
    display: "flex",
    cursor: "pointer",
    lineHeight: "150%",
    padding: "8px 12px",
    borderTop: "1px solid",
    letterSpacing: "-0.42px",
    justifyContent: "center",
    borderRight: "1px solid",
    borderBottom: "1px solid",
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease-in-out",
    borderRadius: "0px 8px 8px 0px",
    color: isactive === "true" ? "#32C794" : "#747d8a",
    borderColor: "#32C794",
    backgroundColor: isactive === "true" ? "#EDFCF7" : "#fff",
  };
});
