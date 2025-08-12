"use client";

import { Box, styled } from "@mui/material";

interface IProps {
  onDelete: () => void;
  onClose: () => void;
}

export default function DeleteAllStudentAlert(props: IProps) {
  const { onClose, onDelete } = props;

  return (
    <Wrapper>
      <ContentWrap>
        <TitleSpan>학생 일괄삭제는 다시 되돌릴 수 없으며</TitleSpan>
        <TitleSpan style={{ color: "#F44336" }}>
          모든 학생의 양치 기록이 삭제됩니다.
        </TitleSpan>
        <TitleSpan>정말 삭제 하시겠습니까?</TitleSpan>
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
    padding: "32px",
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
    gap: "16px",
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
