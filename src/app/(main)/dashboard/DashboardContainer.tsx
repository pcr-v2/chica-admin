"use client";

import { Box, styled } from "@mui/material";

import BottomContent from "@/app/(main)/dashboard/BottomContent";
import MiddleContent from "@/app/(main)/dashboard/MiddleContent";
import TopContent from "@/app/(main)/dashboard/TopContent";
import { BarChart } from "@/app/(main)/dashboard/components/BarChart";
import ChartLine from "@/app/(main)/dashboard/components/LineChart";

export default function DashboardContainer() {
  return (
    <Wrapper>
      <TopContent />

      <MiddleWrap>
        <MiddleContent graph={<ChartLine />} />
        <MiddleContent graph={<BarChart />} />
      </MiddleWrap>

      <BottomWrap>
        <BottomContent />

        <DownloadBtn>전체 데이터 다운로드</DownloadBtn>
      </BottomWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const MiddleWrap = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

const BottomWrap = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "end",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const DownloadBtn = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    color: "#fff",
    fontWeight: 600,
    maxWidth: "240px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "14px 20px",
    backgroundColor: "#32C794",
  };
});
