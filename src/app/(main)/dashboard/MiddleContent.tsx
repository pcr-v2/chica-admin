"use client";

import { Box, styled } from "@mui/material";
import { ReactNode } from "react";

interface IProps {
  graph: ReactNode;
}

export default function MiddleContent(props: IProps) {
  const { graph } = props;

  return (
    <Wrapper>
      <Title>일별 / 주별 실천율</Title>

      {graph}
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    padding: "24px",
    borderRadius: "24px",
    flexDirection: "column",
    backgroundColor: "#fff",
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
