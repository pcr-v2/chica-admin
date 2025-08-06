"use client";

import { Box, styled } from "@mui/material";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import BottomContent from "@/app/(main)/dashboard/BottomContent";
import MiddleContent from "@/app/(main)/dashboard/MiddleContent";
import TopContent from "@/app/(main)/dashboard/TopContent";
import { BarChart } from "@/app/(main)/dashboard/components/BarChart";
import ChartLine from "@/app/(main)/dashboard/components/LineChart";
import { fetchAndSaveHolidays } from "@/app/actions/school/fetchAndSaveHolidays";

interface IProps {
  type: "master" | "teacher";
}

export default function DashboardContainer(props: IProps) {
  const { type } = props;

  const currentYear = dayjs().year();

  const handleHoliday = async () => {
    try {
      const res = await fetchAndSaveHolidays();
      toast.success(res.message);
    } catch (error) {
      // error가 Error 타입일 경우 message 추출
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";

      console.error("handleHoliday Error:", error);
      toast.error(errorMessage); // 에러 메시지 토스트로 표시
    }
  };

  return (
    <Wrapper>
      <TopContent />

      <MiddleWrap>
        <MiddleContent graph={<ChartLine />} />
        <MiddleContent graph={<BarChart />} />
      </MiddleWrap>

      <BottomWrap>
        <BottomContent />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: type === "master" ? "space-between" : "end",
          }}
        >
          {type === "master" && (
            <HolidayBtn onClick={handleHoliday}>
              {currentYear}년 공휴일 추가
            </HolidayBtn>
          )}
          <DownloadBtn
            onClick={() => {
              alert("개발중");
            }}
          >
            전체 데이터 다운로드
          </DownloadBtn>
        </Box>
      </BottomWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const MiddleWrap = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

const BottomWrap = styled(Box)(() => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "end",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const HolidayBtn = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    fontWeight: 600,
    maxWidth: "240px",
    cursor: "pointer",
    color: "#32C794",
    textAlign: "center",
    borderRadius: "8px",
    padding: "14px 20px",
    backgroundColor: "#fff",
    border: "1px solid #32C794",
  };
});

const DownloadBtn = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    color: "#fff",
    fontWeight: 600,
    maxWidth: "240px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "14px 20px",
    backgroundColor: "#32C794",
  };
});
