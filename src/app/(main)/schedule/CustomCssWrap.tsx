"use client";

import { GlobalStyles } from "@mui/material";
import React from "react";

const CustomCode: React.FC = () => {
  return (
    <GlobalStyles
      styles={{
        fontFamily: "Pretandard !important",
        // 전체 달력 보더라디우스
        ".fc": {
          fontSize: 14,
          fontWeight: 600,
          width: "100%",
          maxWidth: "917px",
          height: "753px !important",
          minHeight: "753px !important",
          maxHeight: "753px !important",
        },
        ".fc .fc-scrollgrid-section-liquid > td": {
          border: "none",
        },
        ".fc .fc-scrollgrid-section-header > th": {
          border: "none",
        },
        ".fc .fc-scrollgrid": {
          borderRadius: "10px",
          backgroundColor: "#fff",
          border: "1px solid #E0E0E0",
        },
        ".fc .fc-col-header-cell": {
          padding: "16px 14px 14px",
          backgroundColor: "#F7F8FA",
        },
        ".fc .fc-daygrid-day-top": {
          justifyContent: "start",
          margin: "16px 0px 0px 14px",
        },
        ".fc .fc-daygrid-day.fc-day-today": {
          color: "#13BA81",
          backgroundColor: "rgba(110, 219, 181, 0.12)",
        },
        // 일요일/토요일 헤더
        ".fc-col-header-cell:nth-child(1)": {
          color: "#EF5350",
          backgroundColor: "#FFEBEE",
          borderRadius: "10px 0 0 0",
        },
        ".fc-col-header-cell:nth-child(7)": {
          color: "#48A4FF",
          backgroundColor: "#EBFAFF",
          borderRadius: "0 10px 0 0",
        },
        ".fc-daygrid-day:nth-child(7n+1) .fc-daygrid-day-number": {
          color: "#EF5350",
        },
        ".fc-daygrid-day:nth-child(7n) .fc-daygrid-day-number": {
          color: "#48A4FF",
        },
        ".fc-h-event": {
          margin: "0px 4px !important",
          backgroundColor: "transparent !important",
          border: "none",
        },
      }}
    />
  );
};

export default CustomCode;
