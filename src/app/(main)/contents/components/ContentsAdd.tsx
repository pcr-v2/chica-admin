"use client";

import { Box, styled } from "@mui/material";

import DeleteIcon from "@/public/images/icons/delete-icon.svg";
import PlusIcon from "@/public/images/icons/plus-icon.svg";

export default function ContentsAdd({ onClick }: { onClick: () => void }) {
  return (
    <Wrapper onClick={onClick}>
      <GreenBox>
        <Plus />
      </GreenBox>

      <BottomWrap>
        <TimeSpan>00:00:00</TimeSpan>

        <Delete />
      </BottomWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "8px",
    display: "flex",
    cursor: "pointer",
    flexDirection: "column",
  };
});

const GreenBox = styled(Box)(() => {
  return {
    width: "220px",
    display: "flex",
    height: "220px",
    padding: "20px",
    alignItems: "center",
    borderRadius: "16px",
    justifyContent: "center",
    backgroundColor: "rgba(110, 219, 181, 0.12)",
  };
});

const Plus = styled(PlusIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "40px",
  height: "40px",
  path: {
    fill: "#13BA81",
  },
}));

const Delete = styled(DeleteIcon)(() => ({
  width: "40px",
  height: "40px",
  padding: "6px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "1px solid #F3F3F3",
  path: {
    fill: "#747D8A",
  },
}));

const BottomWrap = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

const TimeSpan = styled("span")(() => {
  return {
    fontSize: 18,
    fontWeight: 400,
    color: "#D5D7DB",
  };
});
