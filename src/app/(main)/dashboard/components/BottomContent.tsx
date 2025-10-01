"use client";

import { Box, Checkbox, CheckboxProps, styled } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PersonalRankTable from "@/app/(main)/dashboard/components/PersonalRankTable";
import UnCheckedTable from "@/app/(main)/dashboard/components/UnCheckedTable";
import FormDatePicker from "@/app/_components/common/FormDatePicker";
import { GetMeResponse } from "@/app/actions/auth/getMe";
import {
  getPersonalRankStatistic,
  GetPersonalRankStatisticResponse,
} from "@/app/actions/statistic/getPersonalRankStatistic";
import { GetUnCheckedStatisticResponse } from "@/app/actions/statistic/getUnCheckedStatistic";
import useResponsive from "@/libs/hooks/useResponsive";

interface CustomCheckboxProps extends CheckboxProps {
  iconSrc?: string;
}

interface IProps {
  me: GetMeResponse;
  personalRankList: GetPersonalRankStatisticResponse;
  unCheckedList: GetUnCheckedStatisticResponse;
}

export default function BottomContent(props: IProps) {
  const { me, personalRankList, unCheckedList } = props;

  const [endAt, setEndAt] = useState("");
  const [startAt, setStartAt] = useState("");
  const [isTotal, setIsTotal] = useState(true);

  const queryClient = useQueryClient();
  const queryKey = ["student-statistic-list"];
  const downTablet = useResponsive("down", "tablet");

  const { data: personalList, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      getPersonalRankStatistic({
        schoolId: me.data?.schoolId as string,
        isTotal,
        searchRange: {
          startAt,
          endAt,
        },
      }),
    initialData: personalRankList,
    staleTime: 0,
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
      <TableWrap>
        <ChartFilter>
          <Title>개인전 순위</Title>
          <DateWrap>
            <CheckboxWrap>
              <CustomCheckbox
                iconSrc="/images/icons/radio-icon.svg"
                value={isTotal}
                checked={isTotal}
                onChange={(e) => setIsTotal(e.target.checked)}
              />
              전체기간
            </CheckboxWrap>

            <FormDatePicker
              sx={(theme) => ({
                width: "100%",
                maxWidth: "150px",
                [theme.breakpoints.down("desktop")]: {
                  maxWidth: "125px",
                },
                "@media (max-width:556px)": {
                  maxWidth: "100%",
                },
              })}
              format="YY-MM-DD"
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

            {!downTablet && <span>~</span>}

            <FormDatePicker
              sx={(theme) => ({
                width: "100%",
                maxWidth: "150px",
                [theme.breakpoints.down("desktop")]: {
                  maxWidth: "125px",
                },
                "@media (max-width:556px)": {
                  maxWidth: "100%",
                },
              })}
              format="YY-MM-DD"
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
          </DateWrap>
        </ChartFilter>

        <PersonalRankTable personalRankList={personalList} />
      </TableWrap>

      <TableWrap>
        <Title>5일 연속 미참여 학생 리스트</Title>

        <UnCheckedTable unCheckedList={unCheckedList} />
      </TableWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(({ theme }) => {
  return {
    gap: "40px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("desktop")]: {
      gap: "24px",
    },
  };
});

const TableWrap = styled(Box)(({ theme }) => {
  return {
    gap: "24px",
    display: "flex",
    padding: "24px",
    aspectRatio: "auto",
    borderRadius: "12px",
    flexDirection: "column",
    backgroundColor: "#fff",
    [theme.breakpoints.down("desktop")]: {
      gap: "12px",
      padding: "20px",
      maxWidth: "100%",
    },
  };
});

const Title = styled(Box)(({ theme }) => {
  return {
    fontSize: 20,
    width: "100%",
    fontWeight: 600,
    color: "#464B53",
    textAlign: "start",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 16,
    },
  };
});

const ChartFilter = styled(motion.div)(({ theme }) => {
  return {
    gap: "16px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("desktop")]: {
      gap: "8px",
      flexWrap: "wrap",
    },
  };
});

const DateWrap = styled(Box)(({ theme }) => {
  return {
    gap: "12px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",

    "@media (max-width:556px)": {
      alignItems: "start",
      flexDirection: "column",
    },
  };
});

const CheckboxWrap = styled(Box)(({ theme }) => {
  return {
    gap: "8px",
    fontSize: 18,
    fontWeight: 400,
    display: "flex",
    color: "#747D8A",
    whiteSpace: "nowrap",
    paddingRight: "12px",
    alignItems: "center",
    [theme.breakpoints.down("desktop")]: {
      gap: "4px",
      fontSize: 14,
    },
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

const SearchBtn = styled(Box)(({ theme }) => {
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
    [theme.breakpoints.down("desktop")]: {
      fontSize: 14,
      height: "30px",
      padding: "4px 8px",
    },
    "@media (max-width:556px)": {
      maxWidth: "100%",
    },
  };
});
