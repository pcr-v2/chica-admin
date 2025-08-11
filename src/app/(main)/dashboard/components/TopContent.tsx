"use client";

import { Box, styled } from "@mui/material";

export default function TopContent() {
  return (
    <Wrapper>
      <Title>양치 실천율</Title>

      <PercentWrap>
        <PercentBox
          style={{
            color: "#fff",
            backgroundColor: "#8EE3C5",
          }}
        >
          <Box>오늘</Box>
          <PercentText>100 %</PercentText>
        </PercentBox>

        <PercentBox>
          <Box>주간</Box>
          <PercentText>100 %</PercentText>
        </PercentBox>

        <PercentBox>
          <Box>월간</Box>
          <PercentText>100 %</PercentText>
        </PercentBox>
      </PercentWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "20px",
    widht: "100%",
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

const PercentWrap = styled(Box)(() => {
  return {
    gap: "24px",
    display: "flex",
    alignItems: "center",
  };
});

const PercentBox = styled(Box)(() => {
  return {
    gap: "12px",
    width: "100%",
    fontWeight: 600,
    display: "flex",
    color: "#747D8A",
    padding: "16px 24px",
    borderRadius: "12px",
    flexDirection: "column",
    backgroundColor: "#F7F8FA",
  };
});

const PercentText = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    fontWeight: 700,
    alignItems: "center",
    justifyContent: "end",
  };
});
