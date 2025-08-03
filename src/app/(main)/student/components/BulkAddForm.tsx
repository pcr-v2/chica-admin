"use client";

import { Box, styled } from "@mui/material";

import DownLoadIcon from "@/public/images/icons/download-icon.svg";
import ExampleImg from "@/public/images/icons/example.png";
import OneIcon from "@/public/images/icons/one-icon.svg";
import ThreeIcon from "@/public/images/icons/three-icon.svg";
import TwoIcon from "@/public/images/icons/two-icon.svg";
import UploadIcon from "@/public/images/icons/upload-icon.svg";

interface IProps {
  bulk: number | null;
  handleDownload: () => void;
  handleUpload: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function BulkAddForm(props: IProps) {
  const { bulk, onConfirm, onClose, handleDownload, handleUpload } = props;

  return (
    <Wrapper>
      <Title>학생 일괄등록</Title>

      <ContentWrap>
        <StepOneWrap>
          <StepBox>
            <One />
            <StepText>CSV 파일 다운로드</StepText>
          </StepBox>

          <DownBtn onClick={handleDownload}>
            <DownLoad />
            <Box>빈 CSV템플릿 다운로드</Box>
          </DownBtn>
        </StepOneWrap>

        <StepTwoWrap>
          <StepBox>
            <Two />
            <StepText>CSV 템플릿에 사용자 정보 추가 또는 수정</StepText>
          </StepBox>
          <DescWrap>
            <Desc style={{ color: "#32C794" }}>
              CSV 템플릿에 대해 자세히 알아보기
            </Desc>
            <Desc>
              이름, 학년, 반, 번호, 성별, 사용여부는 필수 입력란입니다.
            </Desc>
          </DescWrap>

          <ExampleImgSt src={ExampleImg.src} alt="example" />
        </StepTwoWrap>

        <StepOneWrap>
          <StepBox>
            <Three />
            <StepText>CSV 파일 업로드</StepText>
          </StepBox>

          <Box
            sx={{
              gap: "12px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <UploadBtn onClick={handleUpload}>
              <Upload />
              <Box>CSV 파일 첨부</Box>
            </UploadBtn>
            {bulk != null && (
              <BulkDesc>{bulk}명을 일괄등록 하시겠습니까?</BulkDesc>
            )}
          </Box>
        </StepOneWrap>
      </ContentWrap>

      <BtnWrap>
        <Btn sx={{ border: "1px solid #E0E0E0" }} onClick={onClose}>
          취소
        </Btn>
        <Btn
          onClick={onConfirm}
          sx={{
            backgroundColor: bulk != null ? "#32C794" : "#f1f2f3",
            color: bulk != null ? "#fff" : "#D5D7DB",
            pointerEvents: bulk != null ? "auto" : "none",
          }}
        >
          업로드
        </Btn>
      </BtnWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const Title = styled(Box)(() => {
  return {
    width: "100%",
    fontSize: 20,
    fontWeight: 600,
    color: "#13BA81",
    textAlign: "start",
    backgroundColor: "#EDFCF7",
    padding: "16px 12px 16px 24px",
    borderRadius: "12px 12px 0px 0px",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    padding: "28px",
    flexDirection: "column",
  };
});

const ExampleImgSt = styled("img")(() => {
  return {
    width: "100%",
    marginTop: "4px",
    maxWidth: "537px",
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    gap: "16px",
    display: "flex",
    justifyContent: "end",
    padding: "16px 12px 16px 24px",
  };
});

const Btn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "88px",
    fontWeight: 500,
    cursor: "pointer",
    color: "#464B53",
    padding: "8px 12px",
    textAlign: "center",
    borderRadius: "8px",
  };
});

const DownBtn = styled(Box)(() => {
  return {
    gap: "8px",
    fontSize: 16,
    display: "flex",
    fontWeight: 500,
    color: "#fff",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "10px 12px",
    alignItems: "center",
    backgroundColor: "#32C794",
  };
});

const UploadBtn = styled(Box)(() => {
  return {
    gap: "8px",
    fontSize: 16,
    display: "flex",
    fontWeight: 500,
    cursor: "pointer",
    color: "#13BA81",
    textAlign: "center",
    borderRadius: "8px",
    padding: "10px 12px",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #f3f3f3",
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

const DownLoad = styled(DownLoadIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "24px",
  height: "24px",
  path: {
    fill: "#fff",
  },
}));

const Upload = styled(UploadIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "24px",
  height: "24px",
  path: {
    fill: "#13BA81",
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

const StepOneWrap = styled(Box)(() => {
  return {
    gap: "12px",
    display: "flex",
    alignItems: "start",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const StepTwoWrap = styled(Box)(() => {
  return {
    gap: "8px",
    display: "flex",
    alignItems: "start",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const DescWrap = styled(Box)(() => {
  return {
    display: "flex",
    paddingLeft: "22px",
    flexDirection: "column",
  };
});

const Desc = styled("span")(() => {
  return {
    fontSize: 16,
    fontWeight: 400,
    color: "#747D8A",
  };
});

const BulkDesc = styled("span")(() => {
  return {
    fontSize: 14,
    fontWeight: 400,
    color: "#32C794",
  };
});
