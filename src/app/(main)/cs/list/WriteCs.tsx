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
  handleRegist: (value: TCs) => void;
}

export default function WriteCs(props: IProps) {
  const { handleRegist } = props;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <Wrapper>
      <Title>문의글 작성</Title>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
        />

        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ borderRadius: "8px" }}
          onClick={() => handleRegist({ title, content })}
        >
          등록하기
        </Button>
      </Box>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "32px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const Title = styled(Box)(() => {
  return {
    width: "100%",
    fontSize: 24,
    fontWeight: 500,
    lineHeight: "160%",
    color: "#212121",
    textAlign: "center",
    letterSpacing: "-0.24px",
  };
});
