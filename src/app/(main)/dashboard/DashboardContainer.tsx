"use client";

import { Box, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";

import { BarChart } from "@/app/(main)/dashboard/components/BarChart";
import BottomContent from "@/app/(main)/dashboard/components/BottomContent";
import ClassListRank from "@/app/(main)/dashboard/components/ClassListRank";
import ChartLine from "@/app/(main)/dashboard/components/LineChart";
import MiddleContent from "@/app/(main)/dashboard/components/MiddleContent";
import MasterSchoolFilter from "@/app/(main)/schedule/filters/MasterSchoolFilter";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { fetchAndSaveHolidays } from "@/app/actions/school/fetchAndSaveHolidays";
import { getSchoolList } from "@/app/actions/school/getSchoolListAction";
import { getBarChartStatistic } from "@/app/actions/statistic/getBarChartStatistic";
import { getLineChartStatistic } from "@/app/actions/statistic/getLineChartStatistic";

interface IProps {
  me: GetMeResponse;
}

export default function DashboardContainer(props: IProps) {
  const { me } = props;

  const [selectedSchool, setSelectedSchool] = useState("");

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

  const [lineTab, setLineTab] = useState<"day" | "week">("day");
  const [barTab, setBarTab] = useState<"day" | "week">("day");
  const schoolId = selectedSchool || me.data?.schoolId || "";

  const { data: lineData, isFetching: isLineFetching } = useQuery({
    queryKey: ["line", lineTab, schoolId],
    queryFn: () =>
      getLineChartStatistic({
        schoolId,
        type: lineTab,
      }),
    enabled: !!schoolId,
  });
  const { data: barData, isFetching: isBarFetching } = useQuery({
    queryKey: ["bar", barTab, schoolId],
    queryFn: () =>
      getBarChartStatistic({
        schoolId,
        type: barTab,
      }),
    enabled: !!schoolId,
  });
  const { data: schoolList } = useQuery({
    queryKey: ["school-list"],
    queryFn: () => getSchoolList(),
    enabled: me.data?.type === "master",
  });

  return (
    <Wrapper>
      {me.data?.type === "master" && (
        <FilterBox>
          <MasterSchoolFilter
            onChange={(value) => setSelectedSchool(value)}
            schoolList={schoolList?.result ?? []}
            selectedSchool={selectedSchool}
          />
        </FilterBox>
      )}

      <MiddleWrap>
        <MiddleContent
          tab={lineTab}
          graphType="line"
          graph={<ChartLine lineRes={lineData} isLoading={isLineFetching} />}
          onChange={(value) => setLineTab(value)}
        />
        <MiddleContent
          graphType="bar"
          graph={
            <BarChart
              barRes={barData}
              tab={barTab}
              isLoading={isBarFetching}
            />
          }
          tab={barTab}
          onChange={(value) => setBarTab(value)}
        />
      </MiddleWrap>

      <ClassListRank schoolId={schoolId} />

      <BottomWrap>
        <BottomContent schoolId={schoolId} />

        {/* <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent:
              me.data?.type === "master" ? "space-between" : "end",
          }}
        >
          {me.data?.type === "master" && (
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
        </Box> */}
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

const MiddleWrap = styled(Box)(({ theme }) => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("desktop")]: {
      gap: "24px",
      flexDirection: "column",
    },
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

const FilterBox = styled(Box)(({ theme }) => {
  return {
    width: "100%",
    display: "flex",
    maxWidth: "143px",
    borderRadius: "8px",
    justifyContent: "start",
    border: "1px solid #464B53",
    [theme.breakpoints.down("desktop")]: {
      maxWidth: "fit-content",
    },
  };
});
