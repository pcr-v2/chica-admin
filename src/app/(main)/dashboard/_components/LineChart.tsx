"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import React from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// ✅ 1. 차트 옵션 (선 부드럽게)
export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: false,
      text: "일별/주별 통계",
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // ✅ 세로선 제거
      },
    },
    y: {
      grid: {
        drawBorder: false,
        drawTicks: false,
        drawOnChartArea: true, // ✅ chart area 내부에 선 그리기 (기본값 true)
        //   color: (ctx) => {
        //     // 라인 구분 조건 걸고 싶으면 여기서 가능
        //     return "rgba(167, 169, 170, 0.25)";
        //   },
        borderDash: [4, 4], // ✅ 점선 스타일
        lineWidth: 1,
      },
    },
  },
};

// ✅ 2. 라벨: 최근 7일 (2025-07-27 ~ 2025-08-02 형식)
const today = dayjs();
const labels = Array.from({ length: 7 }).map((_, i) =>
  today.subtract(6 - i, "day").format("MM-DD"),
);

// ✅ 3. 데이터: 일별 / 주별 값
const dailyData = [20, 45, 30, 55, 40, 70, 60]; // 직접 넣기
const weeklyData = [40, 50, 60, 45, 55, 65, 70];

export const data = {
  labels,
  datasets: [
    {
      label: "일별",
      data: dailyData,
      borderColor: "#BDDEFF",
      backgroundColor: "rgba(189, 222, 255, 0.5)",
      tension: 0.5, // 선 부드럽게
    },
    {
      label: "주별",
      data: weeklyData,
      borderColor: "#C8F1E3",
      backgroundColor: "rgba(200, 241, 227, 0.5)",
      tension: 0.5,
    },
  ],
};

export default function ChartLine() {
  return <Line options={options} data={data} />;
}
