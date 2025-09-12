"use client";

import { Box, Checkbox, CheckboxProps, styled } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import FormDatePicker from "@/app/_components/common/FormDatePicker";
import Input from "@/app/_components/common/Input";
import { GetSchoolResponse } from "@/app/actions/school/getSchoolAction";

interface CustomCheckboxProps extends CheckboxProps {
  iconSrc?: string;
}

export type TAddScheduleValue = {
  scheduleName: string;
  startAt: string;
  endAt: string;
  target: string[];
};

interface IProps {
  dragDate: { startDate: string; endDate: string } | null;
  getSchoolResult: GetSchoolResponse["result"];
  onConfirm: (value: TAddScheduleValue) => void;
  onClose: () => void;
}

export default function AddScheduleForm(props: IProps) {
  const { getSchoolResult, dragDate, onClose, onConfirm } = props;

  const [scheduleName, setScheduleName] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [target, setTarget] = useState<string[]>([]);

  useEffect(() => {
    if (dragDate != null) {
      setStartAt(dragDate.startDate);
      setEndAt(dragDate.endDate);
    } else {
      setStartAt("");
      setEndAt("");
    }
  }, [dragDate]);

  // console.log("dragDate", dragDate);

  const handleCheckbox = (value: string) => {
    let newTarget = [...target];

    if (value === "all") {
      // all 클릭 시 → 나머지 해제 후 all만 선택
      if (newTarget.includes("all")) {
        newTarget = [];
      } else {
        newTarget = ["all"];
      }
    } else {
      // 개별 학년 선택
      if (newTarget.includes(value)) {
        newTarget = newTarget.filter((el) => el !== value);
      } else {
        newTarget.push(value);
      }

      // all 해제
      newTarget = newTarget.filter((el) => el !== "all");

      // ✅ 전체 학년이 선택되면 all로 변경
      const isElementary = getSchoolResult?.schoolLevel === "elementary";
      const gradeList = isElementary
        ? ["1", "2", "3", "4", "5", "6"]
        : ["1", "2", "3"];

      if (gradeList.every((grade) => newTarget.includes(grade))) {
        newTarget = ["all"];
      }
    }

    setTarget(newTarget);
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
              readOnly={!!dragDate} // dragDate가 존재하면 수정 불가
              value={dragDate?.startDate || startAt} // dragDate가 있으면 그 값 사용
              onChange={(e) => {
                const newStart = e.target.value as string;
                setStartAt(newStart);

                // 만약 endAt이 startAt보다 이전이면 endAt 초기화
                if (
                  endAt &&
                  dayjs(endAt).isBefore(dayjs(newStart).add(1, "day"))
                ) {
                  setEndAt(""); // 또는 newStart로 강제 설정 가능
                  toast.error("종료일은 시작일 이후여야 합니다.");
                }
              }}
            />

            <span>~</span>

            <FormDatePicker
              offMinDate
              value={dragDate?.endDate || endAt} // dragDate가 있으면 그 값 사용
              readOnly={!!dragDate} // dragDate가 존재하면 수정 불가
              onChange={(e) => {
                const newEnd = e.target.value as string;

                if (startAt && dayjs(newEnd).isBefore(dayjs(startAt))) {
                  toast.error("종료일은 시작일 이후여야 합니다.");
                  return; // 값 변경 막기
                }

                setEndAt(newEnd);
              }}
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
                  iconSrc="/images/icons/radio-icon.svg"
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
        <Btn
          sx={{ border: "1px solid #E0E0E0" }}
          onClick={() => {
            onClose();
            setEndAt("");
            setStartAt("");
          }}
        >
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

const CustomCheckbox = styled((props: CustomCheckboxProps) => {
  const { iconSrc, ...rest } = props; // iconSrc 빼고 넘김
  return <Checkbox disableRipple {...rest} />;
})(({ theme, iconSrc }) => ({
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
      backgroundImage: iconSrc ? `url(${iconSrc})` : undefined, // prop 사용
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
