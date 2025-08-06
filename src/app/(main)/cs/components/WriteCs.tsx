"use client";

import { Box, Button, styled } from "@mui/material";
import { useEffect, useState } from "react";

import Input from "@/app/_components/common/Input";
import TextArea from "@/app/_components/common/TextArea";
import { GetCsResponse } from "@/app/actions/cs/getCsAction";

export type TCs = {
  title: string;
  content: string;
  comment?: string; // ✅ 추가
};

interface IProps {
  type: "master" | "teacher";
  updatedData: GetCsResponse["result"];

  onClose: () => void;
  handleRegist: (value: TCs) => void;
}

export default function WriteCs(props: IProps) {
  const { handleRegist, onClose, updatedData, type } = props;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (updatedData != null) {
      setTitle(updatedData.title);
      setContent(updatedData.content);

      if (updatedData.status === "ANSWERED" && updatedData.comment) {
        setComment(updatedData.comment);
      }
    }
  }, [updatedData]);

  return (
    <Wrapper>
      <Title>문의글 {updatedData != null ? "수정" : "작성"}</Title>

      <ContentWrap>
        <Section>
          <TitleSpan>제목</TitleSpan>
          <Input
            disabled={type === "master" || updatedData?.status === "ANSWERED"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            maxLength={72}
          />
        </Section>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          <Section>
            <TitleSpan>문의내용</TitleSpan>
            <TextArea
              disabled={type === "master" || updatedData?.status === "ANSWERED"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <MaxLengthBox>{content.length} / 400</MaxLengthBox>
          </Section>
          {(type === "master" || updatedData?.status === "ANSWERED") && (
            <Section>
              <TitleSpan>관리자 답변</TitleSpan>
              <TextArea
                disabled={updatedData?.status === "ANSWERED"}
                maxLength={200}
                style={{ minHeight: "100px", maxHeight: "100px" }}
                // disabled={type === "master"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <MaxLengthBox>{comment.length} / 200</MaxLengthBox>
            </Section>
          )}
        </Box>
      </ContentWrap>
      <BtnWrap>
        <Btn sx={{ border: "1px solid #E0E0E0" }} onClick={onClose}>
          취소
        </Btn>
        <Btn
          onClick={() => {
            const isTeacher = type === "teacher";
            const isMaster = type === "master";

            const isValidTeacher = title.length > 0 && content.length > 0;
            const isValidMaster =
              comment.length > 0 && updatedData?.status !== "ANSWERED";

            if ((isTeacher && isValidTeacher) || (isMaster && isValidMaster)) {
              handleRegist({ title, content, comment });
            }
          }}
          sx={{
            backgroundColor:
              (type === "teacher" && title.length > 0 && content.length > 0) ||
              (type === "master" &&
                comment.length > 0 &&
                updatedData?.status !== "ANSWERED")
                ? "#32C794"
                : "#f1f2f3",
            color:
              (type === "teacher" && title.length > 0 && content.length > 0) ||
              (type === "master" &&
                comment.length > 0 &&
                updatedData?.status !== "ANSWERED")
                ? "#fff"
                : "#D5D7DB",
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
