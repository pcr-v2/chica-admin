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
    display: "flex",
    padding: "24px",
    borderRadius: "24px",
    flexDirection: "column",
    backgroundColor: "#fff",

    maxWidth: "786.5px",
    width: "calc(50% - 20px)",
    aspectRatio: "786.5 / 487",
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
