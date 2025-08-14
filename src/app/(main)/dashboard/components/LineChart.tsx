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
import React from "react";
import { Line } from "react-chartjs-2";

import { GetLineChartStatisticResponse } from "@/app/actions/statistic/getLineChartStatistic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface IProps {
  lineRes: GetLineChartStatisticResponse;
}

export default function ChartLine({ lineRes }: IProps) {
  const labels = lineRes.data?.labels || [];

  const maleData = lineRes.data?.maleRates || [];
  const femaleData = lineRes.data?.femaleRates || [];
  const totalData = lineRes.data?.rates || [];

  const yMax = Math.max(...[...maleData, ...femaleData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          padding: 15, // ✅ 레전드와 차트 간격 조정
          boxWidth: 12, // 레전드 색상 박스 크기
          boxHeight: 12, // 색상 박스 높이
          font: {
            size: 16, // ✅ 폰트 사이즈
            weight: 400,
            family: "Pretandard",
          },
        },
      },
      title: {
        display: false,
        // text: "일별/주별 통계",
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        min: 0,
        suggestedMax: yMax >= 100 ? yMax * 1.1 : 100, // ✅ 조건부 최대값
        ticks: { stepSize: 10 },
        grid: {
          drawBorder: false,
          drawTicks: false,
          drawOnChartArea: true,
          borderDash: [4, 4],
          lineWidth: 1,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "남학생",
        data: maleData,
        borderColor: "#BDDEFF",
        backgroundColor: "rgba(189, 222, 255, 0.5)",
        tension: 0.4,
      },
      {
        label: "여학생",
        data: femaleData,
        borderColor: "#C8F1E3",
        backgroundColor: "rgba(200, 241, 227, 0.5)",
        tension: 0.4,
      },
      // {
      //   label: "전체",
      //   data: totalData,
      //   borderColor: "#f1dbc8",
      //   backgroundColor: "rgba(241, 219, 200, 0.5)",
      //   tension: 0.5,
      // },
    ],
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line options={options} data={data} />
    </div>
  );
}
