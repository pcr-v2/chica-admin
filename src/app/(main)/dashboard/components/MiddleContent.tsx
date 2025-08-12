"use client";

import { Box, styled } from "@mui/material";
import { ReactNode } from "react";

import ChartTab from "@/app/(main)/dashboard/components/ChartTab";
import { Toggle } from "@/app/_components/common/Toggle";

interface IProps {
  tab: "day" | "week";
  onChange: (value: "day" | "week") => void;
  graph: ReactNode;
}

export default function MiddleContent(props: IProps) {
  const { graph, tab, onChange } = props;

  return (
    <Wrapper>
      <Title>
        <Box>{tab === "day" ? "일별" : "주별"} 실천율</Box>

        <ChartTab tab={tab} onClick={(tab) => onChange(tab)} />
      </Title>

      {graph}
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    display: "flex",
    padding: "24px",
    borderRadius: "24px",
    flexDirection: "column",
    backgroundColor: "#fff",

    maxWidth: "786.5px",
    width: "calc(50% - 20px)",
    aspectRatio: "786.5 / 474",
  };
});

const Title = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    fontWeight: 600,
    color: "#464B53",
    textAlign: "start",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
});
