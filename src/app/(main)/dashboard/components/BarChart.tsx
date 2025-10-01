"use client";

import { Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Chart,
  ChartDataset,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import React from "react";
import { Bar } from "react-chartjs-2";

import { GetBarChartStatisticResponse } from "@/app/actions/statistic/getBarChartStatistic";
import useResponsive from "@/libs/hooks/useResponsive";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface DataLabelContext {
  chart: Chart;
  dataIndex: number; // 현재 데이터 인덱스
  dataset: ChartDataset; // 현재 막대/라인이 속한 dataset
  datasetIndex: number; // dataset 배열에서의 인덱스
  active: boolean; // 마우스 오버 등으로 활성화 여부
}

interface IProps {
  barRes: GetBarChartStatisticResponse;
  tab: "day" | "week";
}

export function BarChart({ barRes, tab }: IProps) {
  const downDesktop = useResponsive("down", "desktop");

  const labels = barRes.data?.labels || [];

  const dailyData = barRes.data?.todayRate || [];
  const dailyCompareData = barRes.data?.yesterdayRate || [];

  const weeklyData = barRes.data?.thisWeekRate || [];
  const weeklyCompareData = barRes.data?.lastWeekRate || [];

  const chartData =
    tab === "day"
      ? [
          { label: "어제", data: dailyCompareData, backgroundColor: "#C8F1E3" },
          { label: "오늘", data: dailyData, backgroundColor: "#BDDEFF" },
        ]
      : [
          {
            label: "지난 주",
            data: weeklyCompareData,
            backgroundColor: "#C8F1E3",
          },
          { label: "이번 주", data: weeklyData, backgroundColor: "#BDDEFF" },
        ];

  // ✅ 최대값 계산 (두 dataset 모두 포함)
  const maxValue = Math.max(...chartData.flatMap((d) => d.data ?? []));
  // ✅ 차트 옵션
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 이게 있어야 부모 높이에 따라 반응함
    plugins: {
      datalabels: {
        display: function (context: DataLabelContext) {
          const value = context.dataset.data[context.dataIndex] as number;
          return value !== 0; // 0이면 안 보이게
        },
        color: "#747d8a",
        anchor: "center" as const,
        align: "center" as const,
        rotation: -30, // -45도 회전, 양수면 시계방향
        font: {
          size: 10,
          weight: "bold" as const,
        },
        formatter: (value: number) => `${Math.round(value)}%`,
      },
      legend: {
        display: true,
        position: "bottom" as const,
        align: "center" as const,
        labels: {
          padding: 15, // ✅ 레전드와 차트 간격 조정
          boxWidth: 12, // 레전드 색상 박스 크기
          boxHeight: 12, // 색상 박스 높이
          font: {
            size: downDesktop ? 12 : 16, // ✅ 폰트 사이즈
            weight: 400,
            family: "Pretandard",
          },
        },
      },
      title: {
        display: false,
        text: "일별 / 주별 바 차트",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        suggestedMax: maxValue <= 100 ? 100 : maxValue * 1.1, // 최대값 +10%
        ticks: { stepSize: 20 },
        grid: {
          drawBorder: false,
          drawTicks: false,
          drawOnChartArea: true,
          color: "rgba(167, 169, 170, 0.25)", // ✅ 점선 색상
          borderDash: [4, 4], // ✅ 점선 스타일
          lineWidth: 1,
        },
      },
    },
  };

  // ✅ Bar 차트 데이터
  const data = {
    labels,
    datasets: chartData.map((d) => ({
      ...d,
      borderRadius: 6,
      barPercentage: 0.5,
      categoryPercentage: 0.5,
    })),
  };

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        [theme.breakpoints.down("desktop")]: {
          minHeight: "400px",
        },
      })}
    >
      <Bar options={options} data={data} />
    </Box>
  );
}
