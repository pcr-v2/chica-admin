"use client";

import { Box, styled } from "@mui/material";

import Croco from "@/public/images/icons/croco-icon.svg";
import Molar from "@/public/images/icons/molar-icon.svg";
import Tail from "@/public/images/icons/tail-icon.svg";

interface IProps {
  text: string;
}

export default function TitleBadge(props: IProps) {
  const { text } = props;

  return (
    <Wrapper>
      <TitleWrap>
        <MolarImg />

        <span style={{ fontFamily: "NanumSquareRound" }}>{text}</span>

        <TailImg />
      </TitleWrap>

      <CrocoImg />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    display: "flex",
    alignItems: "center",
    minHeight: "62px",
  };
});

const TitleWrap = styled(Box)(() => {
  return {
    gap: "8px",
    fontSize: 24,
    fontWeight: 700,
    display: "flex",
    color: "#fff",
    lineHeight: "150%",
    position: "relative",
    borderRadius: "100px",
    background: "#464B53",
    padding: "8px 24px 6px",
    letterSpacing: "-0.64px",
    fontFamily: "NanumSquareRound",
  };
});

const MolarImg = styled(Molar)(() => {
  return {
    width: "32px",
    height: "36px",
  };
});

const TailImg = styled(Tail)(() => {
  return {
    top: 5,
    right: -32,
    width: "40px",
    height: "40px",
    position: "absolute",
  };
});

const CrocoImg = styled(Croco)(() => {
  return {
    marginLeft: "24px",
    width: "40px",
    height: "40px",
  };
});
