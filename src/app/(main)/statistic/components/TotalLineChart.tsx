"use client";

import { Box, Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import React, { useState, useTransition } from "react";
import { Line } from "react-chartjs-2";

import { GetTotalStatisticResponse } from "@/app/actions/statistic/getTotalStatistic";
import useResponsive from "@/libs/hooks/useResponsive";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

interface IProps {
  isLoading: boolean;
  lineRes: GetTotalStatisticResponse["data"];
  gender: "male" | "female" | "both" | "total";
}

/**
 * ✅ 성별/학년별 라인차트
 * - gender === "both" → 학년별 남·여 각각 표시
 * - gender === "male" → 남학생만 표시
 * - gender === "female" → 여학생만 표시
 * - gender === "total" → 남+여 통합 데이터 표시
 */
export default function TotalChartLine({ lineRes, gender, isLoading }: IProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  const downDesktop = useResponsive("down", "desktop");

  const labels = lineRes?.labels || [];
  const grades = lineRes?.grades || [];

  // 🎨 학년별 색상 팔레트
  const maleColors = [
    { border: "#5B87F2", bg: "rgba(91,135,242,0.25)" },
    { border: "#1C64F2", bg: "rgba(28,100,242,0.25)" },
    { border: "#0047AB", bg: "rgba(0,71,171,0.25)" },
    { border: "#3A5AFF", bg: "rgba(58,90,255,0.25)" },
    { border: "#77A6F7", bg: "rgba(119,166,247,0.25)" },
    { border: "#98C1FF", bg: "rgba(152,193,255,0.25)" },
  ];

  const femaleColors = [
    { border: "#F38B00", bg: "rgba(243,139,0,0.25)" },
    { border: "#E55733", bg: "rgba(229,87,51,0.25)" },
    { border: "#F9C301", bg: "rgba(249,195,1,0.25)" },
    { border: "#FF7EB9", bg: "rgba(255,126,185,0.25)" },
    { border: "#FFB6C1", bg: "rgba(255,182,193,0.25)" },
    { border: "#BB61F2", bg: "rgba(187,97,242,0.25)" },
  ];

  const totalColors = [
    { border: "#009688", bg: "rgba(0,150,136,0.25)" },
    { border: "#4CAF50", bg: "rgba(76,175,80,0.25)" },
    { border: "#00BCD4", bg: "rgba(0,188,212,0.25)" },
  ];

  // 🎯 안전한 데이터 반환
  const safeData = (arr: number[] | undefined, labels: string[]) =>
    Array.isArray(arr) && arr.length > 0
      ? arr.map((v) => (typeof v === "number" && !isNaN(v) ? v : 0))
      : labels.map(() => 0);

  // ✅ 차트 옵션
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // 빠른 렌더링
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 15,
          boxWidth: 12,
          boxHeight: 12,
          font: {
            size: downDesktop ? 6 : 8,
            weight: 400,
            family: "Pretendard",
          },
        },
      },
      datalabels: {
        display: true,
        align: "top",
        anchor: "end",
        color: "#212121",
        borderRadius: 12,
        font: {
          size: downDesktop ? 8 : 10,
          weight: 300,
          family: "Pretendard",
        },
        formatter: (value: number) => `${value}%`,
        backgroundColor: (ctx: any) => {
          const color = ctx.dataset.borderColor;
          const hexToRGBA = (hex: string, alpha: number) => {
            const sanitized = hex.replace("#", "");
            const bigint = parseInt(sanitized, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };
          if (color.startsWith("#")) return hexToRGBA(color, 0.3);
          if (color.startsWith("rgb"))
            return color.replace(/[\d.]+\)$/g, "0.3)");
          return color;
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        offset: true, // ✅ 데이터 1개일 때도 가운데로 오게 함
        grid: { display: false },
        ticks: { font: { size: downDesktop ? 12 : 14 } },
      },
      y: {
        min: 0,
        max: 120,
        ticks: { stepSize: 20 },
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

  // 🎯 데이터셋 구성
  const datasets: any[] = [];

  grades.forEach((grade: any, idx: number) => {
    const maleData = safeData(grade.maleValues, labels);
    const femaleData = safeData(grade.femaleValues, labels);
    const totalData = safeData(grade.totalValues, labels);

    // ✅ 데이터 존재 여부 체크
    const hasMaleData =
      Array.isArray(grade.maleValues) && grade.maleValues.length > 0;
    const hasFemaleData =
      Array.isArray(grade.femaleValues) && grade.femaleValues.length > 0;
    const hasTotalData =
      Array.isArray(grade.totalValues) && grade.totalValues.length > 0;

    if (gender === "both") {
      if (hasMaleData)
        datasets.push({
          label: `${grade.grade}학년(남)`,
          data: maleData,
          borderColor: maleColors[idx % maleColors.length].border,
          backgroundColor: maleColors[idx % maleColors.length].bg,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.4,
        });
      if (hasFemaleData)
        datasets.push({
          label: `${grade.grade}학년(여)`,
          data: femaleData,
          borderColor: femaleColors[idx % femaleColors.length].border,
          backgroundColor: femaleColors[idx % femaleColors.length].bg,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.4,
        });
    } else if (gender === "male" && hasMaleData) {
      datasets.push({
        label: `${grade.grade}학년(남)`,
        data: maleData,
        borderColor: maleColors[idx % maleColors.length].border,
        backgroundColor: maleColors[idx % maleColors.length].bg,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
      });
    } else if (gender === "female" && hasFemaleData) {
      datasets.push({
        label: `${grade.grade}학년(여)`,
        data: femaleData,
        borderColor: femaleColors[idx % femaleColors.length].border,
        backgroundColor: femaleColors[idx % femaleColors.length].bg,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
      });
    } else if (gender === "total" && hasTotalData) {
      datasets.push({
        label: `${grade.grade}학년(전체)`,
        data: totalData,
        borderColor: totalColors[idx % totalColors.length].border,
        backgroundColor: totalColors[idx % totalColors.length].bg,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
      });
    }
  });

  const data = { labels, datasets };

  // 🖼 차트 이미지 저장
  const handleSave = async () => {
    // ✅ 저장 중 혹은 transition 중이면 바로 리턴 (중복 방지)
    if (isSaving || isPending) return;

    const node = document.getElementById("save");
    if (!node) return;

    setIsSaving(true); // 저장 시작
    startTransition(async () => {
      try {
        const originalOverflow = node.style.overflow;
        const originalWidth = node.style.width;

        node.style.overflow = "visible";
        node.style.width = `${node.scrollWidth}px`;

        const dataUrl = await toPng(node, {
          width: node.scrollWidth,
          height: node.scrollHeight,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          cacheBust: true,
        });

        node.style.overflow = originalOverflow;
        node.style.width = originalWidth;

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "통계자료.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("이미지 저장 실패:", err);
      } finally {
        // ✅ transition이 끝나더라도 일정 시간 후 해제 (연속 클릭 방지)
        setTimeout(() => setIsSaving(false), 600);
      }
    });
  };

  return (
    <>
      <div
        id="save"
        style={{
          width: "100%",
          overflowX: "auto",
          maxWidth: "1565px",
          minHeight: "360px",
          padding: "0px 0px 24px",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <div
          style={{
            width:
              labels && labels?.length <= 20
                ? "100%"
                : `${(labels?.length ?? 0) * 60}px`,
            minHeight: "350px",
          }}
        >
          {/* key={gender} 로 강제 리렌더 */}
          <Line key={gender} options={options as any} data={data} />

          {(datasets.length === 0 || isLoading) && (
            <div
              style={{
                position: "absolute",
                top: "0%",
                left: "0%",
                width: "100%",
                height: "94%",
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#616161",
                fontSize: 20,
                flexDirection: "column",
                fontWeight: 600,
                zIndex: 10,
                pointerEvents: "none", // ✅ 추가
              }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <CircularProgress size={40} thickness={4} color="success" />
                    <div style={{ fontSize: 18, fontWeight: 500 }}>
                      데이터 불러오는 중...
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div>표시할 데이터가 없습니다.</div>
                    <div style={{ marginTop: 4 }}>
                      (검색 조건 변경 시{" "}
                      <span style={{ fontWeight: 700, color: "#32C794" }}>
                        "검색 버튼"
                      </span>{" "}
                      을 다시 한 번 눌러주세요.)
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <Button
        variant="outlined"
        onClick={handleSave}
        disabled={isSaving || isPending}
        style={{
          width: "100%",
          padding: "10px 0",
          // border: "1px solid #ccc",
          borderRadius: 6,
          // backgroundColor: isSaving || isPending ? "#eee" : "#fff",
          cursor: isSaving || isPending ? "not-allowed" : "pointer",
        }}
      >
        {isSaving || isPending ? "이미지 저장 중..." : "차트를 이미지로 저장"}
      </Button>
    </>
  );
}
