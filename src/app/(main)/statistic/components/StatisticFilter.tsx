"use client";

import { Box, Checkbox, CheckboxProps, Button } from "@mui/material";
import { styled } from "@mui/system";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import FormDatePicker from "@/app/_components/common/FormDatePicker";

interface CustomCheckboxProps extends CheckboxProps {
  iconSrc?: string;
}

interface IProps {
  schoolLevel: "elementary" | "middle" | "high";
  filters: {
    startAt: string;
    endAt: string;
    gender: "male" | "female" | "both" | "total";
    searchDateType: "daily" | "weekly" | "monthly";
    targetGrade: string;
  };
  onChange: (next: Partial<IProps["filters"]>, autoFetch?: boolean) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export default function StatisticFilter({
  schoolLevel,
  filters,
  onChange,
  onSearch,
  isLoading,
}: IProps) {
  const { startAt, endAt, gender, searchDateType, targetGrade } = filters;

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      if (endAt && dayjs(endAt).isBefore(dayjs(value).add(1, "day"))) {
        onChange({ endAt: "" });
        toast.error("종료일은 시작일 이후여야 합니다.");
      }
      onChange({ startAt: value });
    } else {
      if (startAt && dayjs(value).isBefore(dayjs(startAt))) {
        toast.error("종료일은 시작일 이후여야 합니다.");
        return;
      }
      onChange({ endAt: value });
    }
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          gap: "24px",
          marginBottom: "12px",
          flexDirection: "column",
          justifyContent: "start",
        }}
      >
        {/* ✅ 성별 */}
        <Section>
          <TitleSpan>성별</TitleSpan>
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {(["male", "female", "both", "total"] as const).map((value, i) => (
              <CheckboxWrap key={i}>
                <CustomCheckbox
                  iconSrc="/images/icons/radio-icon.svg"
                  checked={gender === value}
                  onChange={() => onChange({ gender: value })}
                />
                {value === "male" && "남"}
                {value === "female" && "여"}
                {value === "both" && "남·여 별도"}
                {value === "total" && "전체 (통합)"}
              </CheckboxWrap>
            ))}
          </Box>
        </Section>

        {/* ✅ 검색일 기준 */}
        <Section>
          <TitleSpan>검색일 기준</TitleSpan>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {(["daily", "weekly", "monthly"] as const).map((value, i) => (
              <CheckboxWrap key={i}>
                <CustomCheckbox
                  iconSrc="/images/icons/radio-icon.svg"
                  checked={searchDateType === value}
                  onChange={() => onChange({ searchDateType: value })}
                />
                {value === "daily" && "일별"}
                {value === "weekly" && "주별"}
                {value === "monthly" && "월별"}
              </CheckboxWrap>
            ))}
          </Box>
        </Section>

        {/* ✅ 대상 학년 */}
        <Section>
          <TitleSpan>대상 학년</TitleSpan>

          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {(schoolLevel === "elementary"
              ? ["1", "2", "3", "4", "5", "6", "total"]
              : ["1", "2", "3", "total"]
            ).map((value, i) => (
              <CheckboxWrap key={i}>
                <CustomCheckbox
                  iconSrc="/images/icons/radio-icon.svg"
                  checked={targetGrade === value}
                  onChange={() => onChange({ targetGrade: value })}
                />
                {value === "1" && "1학년"}
                {value === "2" && "2학년"}
                {value === "3" && "3학년"}
                {value === "4" && "4학년"}
                {value === "5" && "5학년"}
                {value === "6" && "6학년"}
                {value === "total" && "전체"}
              </CheckboxWrap>
            ))}
          </Box>
        </Section>
      </Box>

      {/* ✅ 검색 버튼 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          gap: "32px",
          justifyContent: "end",
          flex: 1,
        }}
      >
        {/* ✅ 일정 선택 */}
        <Section>
          <TitleSpan>일정 시작</TitleSpan>

          <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <FormDatePicker
              offMinDate
              value={startAt}
              onChange={(e) =>
                handleDateChange("start", e.target.value as string)
              }
            />

            <span>~</span>

            <FormDatePicker
              offMinDate
              value={endAt}
              onChange={(e) =>
                handleDateChange("end", e.target.value as string)
              }
            />
          </Box>
        </Section>
        <SearchButton
          onClick={() => {
            if (filters.startAt === "" || filters.endAt === "") {
              toast.error("검색 일자를 입력해주세요.");
              return;
            }

            onSearch();
          }}
          disabled={isLoading || filters.startAt === "" || filters.endAt === ""}
        >
          {isLoading ? "불러오는 중..." : "검색"}
        </SearchButton>
      </Box>
    </div>
  );
}

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

const Section = styled(Box)(() => {
  return {
    gap: "8px",
    // width: "100%",
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

const SearchButton = styled(Button)(() => ({
  backgroundColor: "#32C794",
  color: "#fff",
  fontWeight: 500,
  padding: "6px 20px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#28b285",
  },
  "&:disabled": {
    backgroundColor: "#e0e0e0",
  },
}));
