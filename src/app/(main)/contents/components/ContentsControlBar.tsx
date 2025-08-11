"use client";

import { Box, Button } from "@mui/material";
import { styled } from "@mui/material";

import OneIcon from "@/public/images/icons/one-icon.svg";
import ThreeIcon from "@/public/images/icons/three-icon.svg";
import TwoIcon from "@/public/images/icons/two-icon.svg";

interface IProps {
  contentsLength: number;
  totalSize: number;

  handleUpdloadFiles: () => void;
}

export default function ContentsControlBar(props: IProps) {
  const { contentsLength, totalSize, handleUpdloadFiles } = props;

  return (
    <Wrapper>
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
            가능합니다.&nbsp;
            <span style={{ color: "#32C794" }}>
              (전체 1GB까지 업로드 가능합니다.)
            </span>
          </StepText>
        </StepBox>
        <StepBox>
          <Three />
          <StepText>
            파일을 추가하신 뒤에&nbsp;
            <span style={{ color: "#32C794" }}>꼭 파일 업로드</span>&nbsp;버튼을
            눌러주셔야 업로드가 완료됩니다.
          </StepText>
        </StepBox>
      </DescBox>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <StepText>
            총 파일 갯수&nbsp;
            <span style={{ color: "#3196ff" }}>{contentsLength}개</span>
          </StepText>
          <StepText>
            업로드된 파일 용량&nbsp;
            <span style={{ color: "#3196ff" }}>{totalSize}MB</span>
          </StepText>
        </Box>
        <UploadBtn onClick={handleUpdloadFiles}>파일 업로드</UploadBtn>
      </Box>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "32px",
    width: "100%",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    borderRadius: "12px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#F7F8FA",
  };
});

const DescBox = styled(Box)(() => {
  return {
    gap: "8px",
    width: "100%",
    display: "flex",
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
    display: "flex",
    fontWeight: 500,
    flexWrap: "wrap",
    color: "#747D8A",
  };
});

const UploadBtn = styled(Box)(() => {
  return {
    fontSize: 16,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "8px 16px",
    backgroundColor: "#32C794",
  };
});
