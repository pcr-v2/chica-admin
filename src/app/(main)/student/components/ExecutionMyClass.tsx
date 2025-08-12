"use client";

import { Box, styled } from "@mui/material";

import ArrowIcon from "@/public/images/summary/execution-arrow.svg";
import Icon from "@/public/images/summary/execution-icon-gray.svg";

interface IProps {
  classRate: number;
  classRankInGrade: number;
  classRankInSchool: number;

  countClassInGrade: number;
  countClassInSchool: number;
}

export default function ExecutionMyClass(props: IProps) {
  const {
    classRate,
    classRankInGrade,
    classRankInSchool,
    countClassInGrade,
    countClassInSchool,
  } = props;

  return (
    <Wrapper>
      <Title sx={{ fontFamily: "NanumSquareRound" }}>우리반</Title>

      <BottomWrap>
        <RankRow sx={{ justifyContent: "space-between" }}>
          <ArrowText sx={{ fontFamily: "NanumSquareRound" }}>
            <IconImg />
            양치 실천율
          </ArrowText>

          <ExecutionPercentText sx={{ fontFamily: "NanumSquareRound" }}>
            {classRate}%
          </ExecutionPercentText>
        </RankRow>

        <RankRow>
          <ArrowText sx={{ fontFamily: "NanumSquareRound" }}>
            <ArrowImg />
            우리 학년에서
          </ArrowText>

          <RankTextWrap>
            <TextRank sx={{ fontFamily: "NanumSquareRound" }}>
              {classRankInGrade}등
            </TextRank>
            <TextSlash sx={{ fontFamily: "NanumSquareRound" }}>/</TextSlash>
            <TextTotalCount sx={{ fontFamily: "NanumSquareRound" }}>
              {countClassInGrade}반
            </TextTotalCount>
          </RankTextWrap>
        </RankRow>

        <RankRow>
          <ArrowText sx={{ fontFamily: "NanumSquareRound" }}>
            <ArrowImg />
            우리 학교에서
          </ArrowText>

          <RankTextWrap>
            <TextRank sx={{ fontFamily: "NanumSquareRound" }}>
              {classRankInSchool}등
            </TextRank>
            <TextSlash sx={{ fontFamily: "NanumSquareRound" }}>/</TextSlash>
            <TextTotalCount sx={{ fontFamily: "NanumSquareRound" }}>
              {countClassInSchool}반
            </TextTotalCount>
          </RankTextWrap>
        </RankRow>
      </BottomWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "24px",
    width: "100%",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    borderRadius: "24px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  };
});

const Title = styled(Box)(() => {
  return {
    fontSize: 24,
    width: "100%",
    fontWeight: 800,
    display: "flex",
    color: "#080808",
    lineHeight: "150%",
    alignItems: "center",
    letterSpacing: "-0.56px",
  };
});

const IconImg = styled(Icon)(() => {
  return {};
});

const ArrowImg = styled(ArrowIcon)(() => {
  return {};
});

const BottomWrap = styled(Box)(() => {
  return {
    gap: "12px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const RankRow = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

const ArrowText = styled(Box)(() => {
  return {
    gap: "4px",
    fontSize: 22,
    display: "flex",
    fontWeight: 800,
    color: "#747D8A",
    lineHeight: "150%",
    alignItems: "center",
    letterSpacing: "-0.5px",
  };
});

const ExecutionPercentText = styled(Box)(() => {
  return {
    gap: "4px",
    fontSize: 22,
    fontWeight: 800,
    minWidth: "90px",
    textAlign: "end",
    color: "#464B53",
    lineHeight: "150%",
    letterSpacing: "-0.5px",
  };
});

const RankTextWrap = styled(Box)(() => {
  return {
    gap: "4px",
    fontSize: 22,
    display: "flex",
    fontWeight: 800,
    lineHeight: "150%",
    alignItems: "center",
    letterSpacing: "-0.5px",
  };
});

const TextRank = styled(Box)(() => {
  return {
    minWidth: "90px",
    textAlign: "end",
    color: "#747D8A",
  };
});

const TextSlash = styled(Box)(() => {
  return {
    color: "#D5D7DB",
    paddingLeft: "8px",
  };
});

const TextTotalCount = styled(Box)(() => {
  return {
    minWidth: "58px",
    textAlign: "end",
    color: "#ACB3BC",
  };
});
