import FullCalendar from "@fullcalendar/react";
import { Box, styled } from "@mui/material";
import dayjs from "dayjs";
import React, { forwardRef, useEffect, useState } from "react";

import CalendarIcon from "@/public/images/icons/calendar-icon.svg";
import NextIcon from "@/public/images/icons/calendar-next-icon.svg";
import PrevIcon from "@/public/images/icons/calendar-prev-icon.svg";
import ListIcon from "@/public/images/icons/list-icon.svg";
import ArrowIcon from "@/public/images/icons/pagination/pagi-arrow-next.svg";
import PlusIcon from "@/public/images/icons/plus-icon.svg";

type TBtn = "today" | "next" | "prev";

interface IProps {
  type: "calendar" | "list";
  onClickType: (value: "calendar" | "list") => void;
  onClickAdd: () => void;
}

const ScheduleHeader = forwardRef<FullCalendar, IProps>((props, ref) => {
  const { type, onClickType, onClickAdd } = props;

  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTimeout(() => setReady(true), 50);
  }, []);

  // 현재 보이는 타이틀 갱신
  const updateTitle = () => {
    const calendarRef = ref as React.RefObject<FullCalendar>;
    if (!calendarRef?.current) {
      setTimeout(updateTitle, 50); // 50ms 후 다시 시도
      return;
    }

    const calendarApi = calendarRef.current.getApi();
    const fullTitle = calendarApi.view.title;

    setTitle(fullTitle);
  };

  // FullCalendar에서 datesSet 이벤트에 연결
  useEffect(() => {
    if (type !== "calendar") return;
    if (!ref || !("current" in ref) || !ref.current) return;

    const calendarApi = ref.current.getApi();
    updateTitle();

    calendarApi.on("datesSet", updateTitle);
    return () => calendarApi.off("datesSet", updateTitle);
  }, [type, ready, ref]);

  useEffect(() => {
    if (!ref || !("current" in ref)) return;

    if (!ready) return;

    const calendarApi = ref.current?.getApi();
    calendarApi?.today(); // 뷰를 오늘로 초기화

    updateTitle();
  }, [type, ready]);

  const handleBtn = (value: TBtn) => {
    if (!ref || !("current" in ref)) return;

    if (value === "today") {
      ref.current?.getApi().today();
    } else if (value === "prev") {
      ref.current?.getApi().prev();
    } else if (value === "next") {
      ref.current?.getApi().next();
    }

    updateTitle();
  };

  const currentYear = dayjs().year();

  if (ready === false) return;

  return (
    <Wrapper>
      <LeftWrap>
        <Today onClick={() => handleBtn("today")}>
          오늘
          <Arrow />
        </Today>

        <AddScheduleBtn onClick={onClickAdd}>
          일정등록
          <Plus />
        </AddScheduleBtn>
      </LeftWrap>

      {type === "calendar" ? (
        <CenterWrap>
          <Prev onClick={() => handleBtn("prev")} />
          <Title>{title}</Title>
          <Next onClick={() => handleBtn("next")} />
        </CenterWrap>
      ) : (
        <ListCenterWrap>
          <Title>{currentYear}년도</Title>
        </ListCenterWrap>
      )}

      <RightWrap>
        <CalendarBox
          isactive={(type === "calendar").toString()}
          onClick={() => onClickType("calendar")}
        >
          <Calendar isactive={(type === "calendar").toString()} />
        </CalendarBox>
        <ListBox
          isactive={(type === "list").toString()}
          onClick={() => onClickType("list")}
        >
          <List isactive={(type === "list").toString()} />
        </ListBox>
      </RightWrap>
    </Wrapper>
  );
});

export default ScheduleHeader;

const Wrapper = styled(Box)(() => {
  return {
    gap: "24px",
    width: "100%",
    display: "flex",
    maxWidth: "917px",
    minHeight: "80px",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

const Today = styled(Box)(() => {
  return {
    gap: "4px",
    fontSize: 18,
    fontWeight: 400,
    display: "flex",
    cursor: "pointer",
    color: "#747D8A",
    lineHeight: "150%",
    alignItems: "center",
    padding: "10px 16px",
    borderRadius: "100px",
    border: "1px solid #e0e0e0",
  };
});

const Arrow = styled(ArrowIcon)(() => {
  return {
    width: "24px",
    height: "24px",
  };
});

const Plus = styled(PlusIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "24px",
  height: "24px",
  path: {
    fill: "#747D8A",
  },
}));

const Prev = styled(PrevIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "40px",
  height: "40px",
  cursor: "pointer",
  path: {
    // fill: "#747D8A",
  },
}));

const Next = styled(NextIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "40px",
  height: "40px",
  cursor: "pointer",
  path: {
    // fill: "#747D8A",
  },
}));

const AddScheduleBtn = styled(Box)(() => {
  return {
    gap: "4px",
    fontSize: 18,
    display: "flex",
    fontWeight: 400,
    cursor: "pointer",
    color: "#747D8A",
    padding: "10px 16px",
    alignItems: "center",
    borderRadius: "100px",
    border: "1px solid #e0e0e0",
  };
});

const Calendar = styled(CalendarIcon)<{ isactive: string }>(({ isactive }) => ({
  width: "40px",
  height: "40px",
  path: {
    stroke: isactive === "true" ? "#32C794" : "#D5D7DB",
    strokeWidth: 1.5,
    transition: "all 0.3s ease-in-out",
  },
}));

const List = styled(ListIcon)<{ isactive: string }>(({ isactive }) => ({
  width: "40px",
  height: "40px",
  path: {
    stroke: isactive === "true" ? "#32C794" : "#D5D7DB",
    strokeWidth: 1.5,
    transition: "all 0.3s ease-in-out",
  },
}));

const CalendarBox = styled(Box)<{ isactive: string }>(({ isactive }) => {
  return {
    width: "52px",
    height: "52px",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px 0px 0px 8px",
    transition: "all 0.3s ease-in-out",
    backgroundColor:
      isactive === "true" ? "rgba(110, 219, 181, 0.12)" : "#F7F8FA",
  };
});

const ListBox = styled(Box)<{ isactive: string }>(({ isactive }) => {
  return {
    width: "52px",
    height: "52px",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0px 8px 8px 0px",
    transition: "all 0.3s ease-in-out",
    backgroundColor:
      isactive === "true" ? "rgba(110, 219, 181, 0.12)" : "#F7F8FA",
  };
});

const LeftWrap = styled(Box)(() => {
  return {
    gap: "16px",
    display: "flex",
    alignItems: "center",
  };
});

const CenterWrap = styled(Box)(() => {
  return {
    display: "flex",
    minWidth: "435px",
    alignItems: "center",
    paddingRight: "130px",
    justifyContent: "space-between",
  };
});

const ListCenterWrap = styled(Box)(() => {
  return {
    display: "flex",
    flex: 1,
    // minWidth: "435px",
    alignItems: "center",
    paddingRight: "130px",
    justifyContent: "center",
  };
});

const RightWrap = styled(Box)(() => {
  return {
    display: "flex",
  };
});

const Title = styled("span")(() => {
  return {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: "150%",
    color: "#464B53",
  };
});
