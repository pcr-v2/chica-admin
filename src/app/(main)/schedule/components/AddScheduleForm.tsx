"use client";

import { Box, Checkbox, CheckboxProps, styled } from "@mui/material";
import { useEffect, useState } from "react";

import FormDatePicker from "@/app/_components/common/FormDatePicker";
import Input from "@/app/_components/common/Input";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import { GetScheduleResponse } from "@/app/actions/schedule/getScheduleAction";
import { GetSchoolResponse } from "@/app/actions/school/getSchoolAction";

export type TAddScheduleValue = {
  scheduleName: string;
  startAt: string;
  endAt: string;
  target: string[];
};

interface IProps {
  getSchoolResult: GetSchoolResponse["result"];
  onConfirm: (value: TAddScheduleValue) => void;
  onClose: () => void;
}

export default function AddScheduleForm(props: IProps) {
  const { getSchoolResult, onClose, onConfirm } = props;

  const [scheduleName, setScheduleName] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [target, setTarget] = useState<string[]>([]);

  const handleCheckbox = (value: string) => {
    if (target.includes(value)) {
      const newTarget = target.filter((el) => el !== value);
      setTarget(newTarget);
      return;
    }

    setTarget([...target, value]);
  };

  const isFormComplete = () => {
    return (
      scheduleName.trim() !== "" &&
      startAt.trim() !== "" &&
      endAt.trim() !== "" &&
      target.length > 0
    );
  };

  return (
    <Wrapper>
      <Title>일정 {null != null ? "수정" : "등록"}</Title>

      <ContentWrap>
        <Section>
          <TitleSpan>일정명</TitleSpan>

          <Input
            onChange={(e) => setScheduleName(e.target.value)}
            value={scheduleName}
            placeholder="일정명을 입력해 주세요."
            type="text"
            sx={{ width: "100%", maxWidth: "237ㅔㅌ" }}
          />
        </Section>

        <Section>
          <TitleSpan>일정 시작</TitleSpan>

          <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <FormDatePicker
              offMinDate
              value={startAt}
              onChange={(e) => setStartAt(e.target.value as string)}
            />

            <span>~</span>

            <FormDatePicker
              value={endAt}
              onChange={(e) => setEndAt(e.target.value as string)}
            />
          </Box>
        </Section>

        <Section>
          <TitleSpan>대상학년</TitleSpan>

          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {(getSchoolResult?.schoolLevel === "elementary"
              ? ["1", "2", "3", "4", "5", "6", "all"]
              : ["1", "2", "3", "all"]
            ).map((value, i) => (
              <CheckboxWrap key={i}>
                <CustomCheckbox
                  value={value}
                  checked={target.includes(value)}
                  onChange={() => handleCheckbox(value)}
                />
                {value === "1" && "1학년"}
                {value === "2" && "2학년"}
                {value === "3" && "3학년"}
                {value === "4" && "4학년"}
                {value === "5" && "5학년"}
                {value === "6" && "6학년"}
                {value === "all" && "전체"}
              </CheckboxWrap>
            ))}
          </Box>
        </Section>
      </ContentWrap>

      <BtnWrap>
        <Btn sx={{ border: "1px solid #E0E0E0" }} onClick={onClose}>
          취소
        </Btn>
        <Btn
          onClick={() =>
            onConfirm({
              scheduleName,
              startAt,
              endAt,
              target,
            })
          }
          sx={{
            backgroundColor: isFormComplete() ? "#32C794" : "#f1f2f3",
            color: isFormComplete() ? "#fff" : "#D5D7DB",
            pointerEvents: isFormComplete() ? "auto" : "none",
          }}
        >
          저장
        </Btn>
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

const Title = styled(Box)(() => {
  return {
    width: "100%",
    fontSize: 20,
    fontWeight: 600,
    color: "#13BA81",
    textAlign: "start",
    backgroundColor: "#EDFCF7",
    padding: "16px 12px 16px 24px",
    borderRadius: "12px 12px 0px 0px",
  };
});

const ContentWrap = styled(Box)(() => {
  return {
    gap: "28px",
    width: "100%",
    display: "flex",
    padding: "28px",
    flexDirection: "column",
  };
});

const Section = styled(Box)(() => {
  return {
    gap: "8px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
});

const TitleSpan = styled("span")(() => {
  return {
    fontSize: 16,
    fontWeight: 500,
    color: "#747D8A",
  };
});

const SectionWrap = styled(Box)(() => {
  return {
    gap: "16px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
});

const CustomCheckbox = styled((props: CheckboxProps) => (
  <Checkbox disableRipple {...props} />
))(({ theme }) => ({
  margin: 0,
  width: 20,
  height: 20,
  padding: "2px",
  position: "relative",
  "&:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiSvgIcon-root": {
    display: "none",
  },
  "& .MuiTouchRipple-root": {
    display: "none",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: "4px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    border: "1px solid #d9d9d9",
    transition: "all 0.2s linear",
  },
  "&.Mui-checked": {
    "&::before": {
      backgroundColor: "#32C794",
      borderColor: "#13BA81",
    },
    "&::after": {
      width: 20,
      height: 20,
      top: "50%",
      left: "50%",
      content: '""',
      position: "absolute",
      backgroundImage: 'url("/images/icons/radio-icon.svg")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
      transform: "translate(-50%, -50%)",
    },
  },
}));

const CheckboxWrap = styled(Box)(() => {
  return {
    gap: "8px",
    fontSize: 16,
    fontWeight: 400,
    display: "flex",
    color: "#747D8A",
    alignItems: "center",
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    gap: "16px",
    display: "flex",
    justifyContent: "end",
    padding: "16px 28px 28px",
  };
});

const Btn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "88px",
    fontWeight: 500,
    cursor: "pointer",
    color: "#464B53",
    padding: "8px 12px",
    textAlign: "center",
    borderRadius: "8px",
  };
});
