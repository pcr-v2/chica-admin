"use client";

import { Box, styled } from "@mui/material";

interface IProps {
  onDelete: () => void;
  onClose: () => void;
}

export default function DeleteScheduleAlert(props: IProps) {
  const { onClose, onDelete } = props;

  return (
    <Wrapper>
      <Title>일정 삭제</Title>

      <ContentWrap>
        <TitleSpan>여러 날에 걸친 일정은 모두 삭제해야</TitleSpan>
        <TitleSpan>양치가 기록 됩니다.</TitleSpan>
        <TitleSpan style={{ color: "#F44336" }}>
          정말 삭제 하시겠습니까?
        </TitleSpan>
      </ContentWrap>

      <BtnWrap>
        <DeleteBtn onClick={onDelete}>삭제</DeleteBtn>

        <Btn onClick={onClose}>취소</Btn>
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
    color: "#F44336",
    textAlign: "start",
    backgroundColor: "#FCE4EC",
    padding: "16px 12px 16px 24px",
    borderRadius: "12px 12px 0px 0px",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    gap: "8px",
    width: "100%",
    display: "flex",
    padding: "28px",
    flexDirection: "column",
  };
});

const TitleSpan = styled("span")(() => {
  return {
    fontSize: 16,
    fontWeight: 500,
    color: "#747D8A",
    textAlign: "center",
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    gap: "24px",
    display: "flex",
    padding: "0px 24px 28px 24px",
    justifyContent: "space-between",
  };
});

const Btn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "100%",
    fontWeight: 500,
    cursor: "pointer",
    color: "#464B53",
    padding: "8px 12px",
    textAlign: "center",
    borderRadius: "8px",
    border: "1px solid #E0E0E0",
  };
});

const DeleteBtn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "100%",
    fontWeight: 500,
    color: "#fff",
    cursor: "pointer",
    padding: "8px 12px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "#F44336",
  };
});
