"use client";

import { Box, styled } from "@mui/material";

export default function StatisticDesc() {
  return (
    <DescBox>
      <StepBox>
        <StepText>
          · 통계 데이터 시작일과 종료일을 입력하세요.{" "}
          <span style={{ color: "#32C794" }}>(직접 입력도 가능합니다.)</span>
        </StepText>
      </StepBox>
      <StepBox>
        <StepText>
          · 당해년도가 아닌 날짜가 포함되면 통계가 달라질수있습니다.
        </StepText>
      </StepBox>
      <StepBox>
        <StepText>
          · 검색일 기준은 차트에 나오는 X축을 의미합니다. (일단위, 주단위,
          월단위)
        </StepText>
      </StepBox>

      <StepBox>
        <StepText>
          · 원본 데이터가 필요하신 경우{" "}
          <span style={{ color: "#32C794" }}>
            고객센터를 통해서 문의 해주세요.
          </span>
        </StepText>
      </StepBox>

      <StepBox>
        <StepText>
          · 차트의 X축 하단{" "}
          <span style={{ color: "#32C794" }}>데이터 라벨을 클릭 시</span> 원하는
          그래프를 선택적으로 확인 가능합니다.
        </StepText>
      </StepBox>

      <StepBox>
        <StepText>
          · 조건을 변경하실 경우{" "}
          <span style={{ color: "#32C794" }}>검색 버튼</span>을 다시 한 번
          눌러주세요.
        </StepText>
      </StepBox>
    </DescBox>
  );
}

const DescBox = styled(Box)(() => {
  return {
    gap: "8px",
    width: "100%",
    display: "flex",
    padding: "16px",
    borderRadius: "12px",
    flexDirection: "column",
    backgroundColor: "#f7f8fa",
  };
});

const StepBox = styled(Box)(() => {
  return {
    gap: "4px",
    display: "flex",
    alignItems: "center",
  };
});

const StepText = styled("span")(() => {
  return {
    fontSize: 18,
    fontWeight: 500,
    color: "#747D8A",
  };
});
