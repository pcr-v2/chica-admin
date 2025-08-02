"use client";

import { Box, Button, styled } from "@mui/material";
import { useState } from "react";

import Input from "@/app/_components/common/Input";
import TextArea from "@/app/_components/common/TextArea";

export type TCs = {
  title: string;
  content: string;
};

interface IProps {
  onClose: () => void;
  handleRegist: (value: TCs) => void;
}

export default function WriteCs(props: IProps) {
  const { handleRegist, onClose } = props;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <Wrapper>
      <Title>문의글 작성</Title>

      <ContentWrap>
        <Section>
          <TitleSpan>제목</TitleSpan>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            maxLength={72}
          />
        </Section>
        <Section>
          <TitleSpan>문의내용</TitleSpan>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <MaxLengthBox>{content.length} / 400</MaxLengthBox>
        </Section>

        {/* <Button
          variant="contained"
          fullWidth
          sx={{ borderRadius: "8px" }}
          onClick={() => handleRegist({ title, content })}
          >
          등록하기
          </Button> */}
      </ContentWrap>
      <BtnWrap>
        <Btn sx={{ border: "1px solid #E0E0E0" }} onClick={onClose}>
          취소
        </Btn>
        <Btn
          onClick={() => {
            if (title.length > 0 && content.length > 0) {
              handleRegist({ title, content });
              return;
            }
          }}
          sx={{
            backgroundColor:
              title.length > 0 && content.length > 0 ? "#32C794" : "#f1f2f3",
            color: title.length > 0 && content.length > 0 ? "#fff" : "#D5D7DB",
          }}
        >
          저장
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
    gap: "28px",
    width: "100%",
    display: "flex",
    padding: "28px",
    flexDirection: "column",
  };
});

const Section = styled(Box)(() => {
  return {
    gap: "8px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const TitleSpan = styled("span")(() => {
  return {
    fontSize: 16,
    fontWeight: 500,
    color: "#747D8A",
  };
});

const MaxLengthBox = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "100%",
    display: "flex",
    fontWeight: 400,
    color: "#747D8A",
    justifyContent: "end",
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
