"use client";

import { Box, styled } from "@mui/material";

import ArrowIcon from "@/public/images/summary/execution-arrow.svg";
import Icon from "@/public/images/summary/execution-icon.svg";
import Pattern from "@/public/images/summary/execution-pattern.png";

interface IProps {
  myRate: number;
  myRankInClass: number;
  myRankInGrade: number;
  myRankInSchool: number;

  classPeopleCount: number;
  gradePeopleCount: number;
  schoolPeopleCount: number;
}

export default function Execution(props: IProps) {
  const {
    myRate,
    myRankInClass,
    myRankInGrade,
    myRankInSchool,
    classPeopleCount,
    gradePeopleCount,
    schoolPeopleCount,
  } = props;

  return (
    <Wrapper>
      <Title>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            fontFamily: "NanumSquareRound",
          }}
        >
          <IconImg />
          양치 실천율
        </Box>

        <Box sx={{ fontFamily: "NanumSquareRound" }}>{myRate}%</Box>
      </Title>

      <BottomWrap>
        <RankRow>
          <ArrowText sx={{ fontFamily: "NanumSquareRound" }}>
            <ArrowImg />
            우리 반에서
          </ArrowText>

          <RankTextWrap>
            <TextGreen sx={{ fontFamily: "NanumSquareRound" }}>
              {myRankInClass}등
            </TextGreen>
            <TextSlash sx={{ fontFamily: "NanumSquareRound" }}>/</TextSlash>
            <TextTotalCount sx={{ fontFamily: "NanumSquareRound" }}>
              {classPeopleCount}명
            </TextTotalCount>
          </RankTextWrap>
        </RankRow>

        <RankRow>
          <ArrowText sx={{ fontFamily: "NanumSquareRound" }}>
            <ArrowImg />
            우리 학년에서
          </ArrowText>

          <RankTextWrap>
            <TextGreen sx={{ fontFamily: "NanumSquareRound" }}>
              {myRankInGrade}등
            </TextGreen>
            <TextSlash sx={{ fontFamily: "NanumSquareRound" }}>/</TextSlash>
            <TextTotalCount sx={{ fontFamily: "NanumSquareRound" }}>
              {gradePeopleCount}명
            </TextTotalCount>
          </RankTextWrap>
        </RankRow>

        <RankRow>
          <ArrowText sx={{ fontFamily: "NanumSquareRound" }}>
            <ArrowImg />
            우리 학교에서
          </ArrowText>

          <RankTextWrap>
            <TextGreen sx={{ fontFamily: "NanumSquareRound" }}>
              {myRankInSchool}등
            </TextGreen>
            <TextSlash sx={{ fontFamily: "NanumSquareRound" }}>/</TextSlash>
            <TextTotalCount sx={{ fontFamily: "NanumSquareRound" }}>
              {schoolPeopleCount}명
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
    color: "#fff",
    fontWeight: 800,
    display: "flex",
    lineHeight: "150%",
    borderRadius: "12px",
    padding: "12px 24px",
    alignItems: "center",
    letterSpacing: "-0.56px",
    justifyContent: "space-between",
    background: `url(${Pattern.src}) no-repeat #6EDBB5`,
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

const RankTextWrap = styled(Box)(() => {
  return {
    gap: "4px",
    fontSize: 22,
    display: "flex",
    fontWeight: 800,
    color: "#ACB3BC",
    lineHeight: "150%",
    alignItems: "center",
    letterSpacing: "-0.5px",
  };
});

const TextGreen = styled(Box)(() => {
  return {
    minWidth: "90px",
    textAlign: "end",
    color: "#6EDBB5",
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
    minWidth: "74px",
    textAlign: "end",
  };
});
