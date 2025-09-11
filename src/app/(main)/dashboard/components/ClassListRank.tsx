"use client";

import { Box, Checkbox, CheckboxProps, styled } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ClassRankChart from "@/app/(main)/dashboard/components/ClassRankChart";
import FormDatePicker from "@/app/_components/common/FormDatePicker";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import {
  getClassRankListStatistic,
  GetClassRankListStatisticResponse,
} from "@/app/actions/statistic/getClassRankListStatistic";

interface IProps {
  me: GetMeResponse;
  classRankList: GetClassRankListStatisticResponse;
}

export default function ClassListRank(props: IProps) {
  const { me, classRankList } = props;

  const [endAt, setEndAt] = useState("");
  const [startAt, setStartAt] = useState("");
  const [isTotal, setIsTotal] = useState(true);

  const queryKey = ["classRankList"];
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      getClassRankListStatistic({
        schoolId: me.data?.schoolId!,
        isTotal,
        searchRange: {
          startAt: startAt ?? null,
          endAt: endAt ?? null,
        },
      }),
    initialData: classRankList,
    staleTime: 0,
    enabled: false, // 자동 실행 금지
  });

  useEffect(() => {
    if (isTotal) {
      setEndAt("");
      setStartAt("");
    }
  }, [isTotal]);

  const handleSearch = async () => {
    if (!isTotal && (!startAt || !endAt)) {
      toast.error("조회 기간을 선택해주세요.");
      return;
    }
    refetch();
    await queryClient.invalidateQueries({ queryKey });
  };

  return (
    <Wrapper>
      <Box
        sx={{
          gap: "16px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Title sx={{ width: "100%" }}>반별 리더보드</Title>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: "12px",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <CheckboxWrap>
            <CustomCheckbox
              value={isTotal}
              checked={isTotal}
              onChange={(e) => setIsTotal(e.target.checked)}
            />
            전체기간
          </CheckboxWrap>
          <FormDatePicker
            sx={{ width: "100%", maxWidth: "150px" }}
            offMinDate
            readOnly={isTotal}
            value={startAt} // dragDate가 있으면 그 값 사용
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
            sx={{ width: "100%", maxWidth: "150px" }}
            offMinDate
            readOnly={isTotal}
            value={endAt} // dragDate가 있으면 그 값 사용
            onChange={(e) => {
              const newEnd = e.target.value as string;

              if (startAt && dayjs(newEnd).isBefore(dayjs(startAt))) {
                toast.error("종료일은 시작일 이후여야 합니다.");
                return; // 값 변경 막기
              }

              setEndAt(newEnd);
            }}
          />

          <SearchBtn onClick={handleSearch}>조회</SearchBtn>
        </Box>
      </Box>

      <ClassRankChart classRankList={data} />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "40px",
    display: "flex",
    padding: "24px",
    borderRadius: "24px",
    flexDirection: "column",
    backgroundColor: "#fff",

    aspectRatio: "1565 / 474",
  };
});

const Title = styled("span")(() => {
  return {
    fontSize: 20,
    fontWeight: 600,
    display: "flex",
    color: "#464B53",
    textAlign: "start",
    alignItems: "center",
  };
});

const SearchBtn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "100%",
    height: "44px",
    color: "#fff",
    fontWeight: 600,
    display: "flex",
    maxWidth: "64px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "8px 12px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#32C794",
  };
});

const CheckboxWrap = styled(Box)(() => {
  return {
    gap: "8px",
    fontSize: 18,
    fontWeight: 400,
    display: "flex",
    color: "#747D8A",
    paddingRight: "12px",
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

const GraphWrap = styled(Box)(() => {
  return {
    gap: "8px",
    width: "100%",
    maxWidth: "54px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const ClassText = styled(motion.div)(() => {
  return {
    fontSize: 25,
    width: "54px",
    fontWeight: 700,
    lineHeight: "150%",
    color: "#464b53",
    textAlign: "center",
    letterSpacing: "-0.5px",
  };
});

const GraphBar = styled(motion.div)(() => {
  return {
    width: "48px",
    borderRadius: "12px",
  };
});

const BoardContent = styled(motion.div)(() => {
  return {
    gap: "32px",
    width: "100%",
    display: "flex",
    alignItems: "end",
  };
});
