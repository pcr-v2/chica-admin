"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

// a plugin!

export default function TestContainer() {
  const list = [
    { title: "테스트1", date: "2025-08-13 - 2025-08-22" },
    { title: "테스트222", date: "2025-08-14" },
  ];

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locale={"kr"}
      events={list}
    />
  );
}
