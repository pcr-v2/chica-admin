"use client";

import { Box, styled } from "@mui/material";

import OneIcon from "@/public/images/icons/one-icon.svg";
import ThreeIcon from "@/public/images/icons/three-icon.svg";
import TwoIcon from "@/public/images/icons/two-icon.svg";

export default function ContentsDesc() {
  return (
    <DescBox>
      <StepBox>
        <One />
        <StepText>
          이미지는 10초, 동영상은 영상 길이만큼 자동 재생됩니다.
        </StepText>
      </StepBox>
      <StepBox>
        <Two />
        <StepText>
          단일 파일 기준으로 이미지 파일은 10MB, 동영상 파일은 30MB까지 업로드
          가능합니다.&nbsp;&nbsp;
          <span style={{ color: "#32C794" }}>
            (전체 1GB까지 업로드 가능합니다.)
          </span>
        </StepText>
      </StepBox>
      <StepBox>
        <Three />
        <StepText>
          파일명은 한글 지원이 어렵기에 영문을 권장 드립니다. &nbsp;&nbsp;
          <span style={{ color: "#32C794" }}>
            (한글로 저장시 임의의 영문으로 저장됩니다.)
          </span>
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

const One = styled(OneIcon)<{ isopen: string }>(({ isopen }) => ({
  path: {
    fill: "#747D8A",
  },
}));

const Two = styled(TwoIcon)<{ isopen: string }>(({ isopen }) => ({
  path: {
    fill: "#747D8A",
  },
}));

const Three = styled(ThreeIcon)<{ isopen: string }>(({ isopen }) => ({
  path: {
    fill: "#747D8A",
  },
}));

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
