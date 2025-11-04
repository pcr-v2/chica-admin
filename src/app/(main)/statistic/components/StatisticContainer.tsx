"use client";

import { Box, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";

import StatisticDesc from "@/app/(main)/statistic/components/StatisticDesc";
import StatisticFilter from "@/app/(main)/statistic/components/StatisticFilter";
import TotalChartLine from "@/app/(main)/statistic/components/TotalLineChart";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { getTotalStatistic } from "@/app/actions/statistic/getTotalStatistic";

interface IProps {
  me: GetMeResponse;
}

export default function StatisticContainer({ me }: IProps) {
  const [filters, setFilters] = useState({
    startAt: "",
    endAt: "",
    gender: "total" as "male" | "female" | "both" | "total",
    searchDateType: "weekly" as "daily" | "weekly" | "monthly",
    targetGrade: "total" as string,
  });

  // ✅ 마지막으로 성공적으로 조회된 데이터 저장용
  const [lastData, setLastData] = useState<any>(null);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["totalStatistic", me.data?.schoolId],
    queryFn: () =>
      getTotalStatistic({
        schoolId: me.data?.schoolId!,
        gender: filters.gender,
        searchDateType: filters.searchDateType,
        searchRange: {
          startAt: filters.startAt ?? "",
          endAt: filters.endAt ?? "",
        },
        targetGrade: filters.targetGrade,
      }),
    enabled: false,
    staleTime: 0,
  });

  // ✅ refetch 후 성공 시 lastData 갱신
  const handleSearch = async () => {
    const res = await refetch();
    if (res.data?.data) {
      setLastData(res.data.data);
    }
  };

  const handleFilterChange = useCallback(
    (nextFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...nextFilters }));
      // refetch 안 함 → 검색 버튼 전에는 lastData 유지
    },
    [],
  );

  return (
    <Wrapper>
      <StatisticDesc />

      <StatisticFilter
        schoolLevel={me.data?.schoolLevel as "elementary" | "middle" | "high"}
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        isLoading={isFetching}
      />

      {/* ✅ 데이터 존재 여부에 따라 표시 */}
      <TotalChartLine
        isLoading={isFetching}
        lineRes={lastData ?? []} // 검색 전에는 제로베이스 (빈 차트)
        gender={filters.gender}
      />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => ({
  gap: "40px",
  width: "100%",
  display: "flex",
  borderRadius: "24px",
  padding: "32px 28px",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "#fff",
}));
