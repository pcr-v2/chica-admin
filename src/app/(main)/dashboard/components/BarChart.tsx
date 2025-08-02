"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// ✅ 요일 라벨 (한글)
const labels = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

// ✅ faker 제거한 수동/mock 데이터
const dailyData = [300, 500, 200, 700, 400, 600, 100];
const weeklyData = [220, 420, 180, 580, 360, 520, 90];

// ✅ Bar 차트 데이터
export const data = {
  labels,
  datasets: [
    {
      label: "일별",
      data: dailyData,
      backgroundColor: "#BDDEFF",
      borderRadius: 6,
      barPercentage: 0.5,
      categoryPercentage: 0.5,
    },
    {
      label: "주별",
      data: weeklyData,
      backgroundColor: "#C8F1E3",
      borderRadius: 6,
      barPercentage: 0.5,
      categoryPercentage: 0.5,
    },
  ],
};

// ✅ 차트 옵션
export const options = {
  responsive: true,
  maintainAspectRatio: false, // 이게 있어야 부모 높이에 따라 반응함
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
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
      beginAtZero: true,
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

export function BarChart() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Bar options={options} data={data} />
    </div>
  );
}
