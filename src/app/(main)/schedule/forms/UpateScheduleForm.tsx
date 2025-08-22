"use client";

import { Box, styled } from "@mui/material";

import { TUpdateDate } from "@/app/(main)/schedule/ScheduleContainer";
import SwitchIcon from "@/public/images/icons/switch-icon.svg";

interface IProps {
  value: TUpdateDate;
  onUpdate: () => void;
  onClose: () => void;
}

export default function UpateScheduleForm(props: IProps) {
  const { onUpdate, onClose } = props;
  const { scheduleSetId, startDate, endDate, newStartDate, newEndDate } =
    props.value;
  // console.log("scheduleSetId", scheduleSetId);
  return (
    <Wrapper>
      {/* <Title>일정 삭제</Title> */}

      <ContentWrap>
        <TitleSpan style={{ color: "#F44336" }}>
          기존 일자
          {" ("}
          {startDate === endDate ? startDate : `${startDate} ~ ${endDate}`}
          {")"}
        </TitleSpan>
        <Switch />
        <TitleSpan style={{ color: "#32C794" }}>
          변경 일자{" ("}
          {newStartDate === newEndDate
            ? newStartDate
            : `${newStartDate} ~ ${newEndDate}`}
          {")"}
        </TitleSpan>
        <TitleSpan>수정 하시겠습니까?</TitleSpan>
      </ContentWrap>

      <BtnWrap>
        <UpdateBtn onClick={onUpdate}>수정</UpdateBtn>

        <Btn onClick={onClose}>취소</Btn>
      </BtnWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const Switch = styled(SwitchIcon)(() => {
  return {
    width: "24px",
    height: "24px",
    path: {
      stroke: "#747D8A",
    },
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    gap: "8px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: "52px 28px 28px",
  };
});

const TitleSpan = styled("span")(() => {
  return {
    fontSize: 16,
    fontWeight: 500,
    color: "#747D8A",
    textAlign: "center",
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    gap: "24px",
    display: "flex",
    padding: "0px 24px 28px 24px",
    justifyContent: "space-between",
  };
});

const Btn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "100%",
    fontWeight: 500,
    cursor: "pointer",
    color: "#464B53",
    padding: "8px 12px",
    textAlign: "center",
    borderRadius: "8px",
    border: "1px solid #E0E0E0",
  };
});

const UpdateBtn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "100%",
    fontWeight: 500,
    color: "#fff",
    cursor: "pointer",
    padding: "8px 12px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "#32C794",
  };
});
