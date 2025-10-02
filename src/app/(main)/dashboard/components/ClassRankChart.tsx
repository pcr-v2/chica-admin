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
import ChartDataLabels from "chartjs-plugin-datalabels";
import React from "react";
import { Bar } from "react-chartjs-2";

import { GetClassRankListStatisticResponse } from "@/app/actions/statistic/getClassRankListStatistic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

interface IProps {
  classRankList: GetClassRankListStatisticResponse;
  isRound: boolean;
}

export default function ClassRankChart(props: IProps) {
  const { classRankList, isRound } = props;

  const rates = classRankList.data?.classList.map((d) => d.rate) ?? [];
  const maxValue = Math.max(...rates);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x" as const,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "white",
        anchor: "center" as const,
        align: "center" as const,
        rotation: -30, // -45도 회전, 양수면 시계방향
        font: {
          size: isRound ? 12 : 9,
          weight: "bold" as const,
        },
        formatter: (value: number) =>
          isRound ? `${Math.round(value)}%` : `${value}%`,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: {
            size: 10, // 원하는 폰트 크기
            weight: "normal" as const,
          },
        },
      },
      y: {
        min: 0,
        suggestedMax: maxValue <= 80 ? maxValue * 1.1 : 100, // 최대값 +10%
        ticks: { stepSize: 10 },
        grid: {
          drawBorder: false,
          drawTicks: false,
          drawOnChartArea: true,
          color: "rgba(167, 169, 170, 0.25)",
          borderDash: [4, 4],
          lineWidth: 1,
        },
      },
    },
  };

  const labels = classRankList.data?.classList.map(
    (d) => `${d.grade}학년 ${d.class}반`,
  );

  const data = {
    labels,
    datasets: [
      {
        label: "반별 양치율 (%)",
        data: classRankList.data?.classList.map((d) => d.rate) ?? [],
        borderRadius: 6,
        maxBarThickness: 48,
        backgroundColor: "rgba(73, 196, 196, 0.6)",
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        maxWidth: "1565px",
        minHeight: "350px",
        padding: "0px 0px 24px",
      }}
    >
      <div
        style={{
          width:
            labels && labels?.length <= 16
              ? "100%"
              : `${(labels?.length ?? 0) * 60}px`,
          height: "100%",
        }}
      >
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
