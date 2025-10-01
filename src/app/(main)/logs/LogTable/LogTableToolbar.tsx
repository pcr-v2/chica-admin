"use client";

import { Box, styled } from "@mui/material";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { LogRow } from "@/app/(main)/logs/LogTable/useLogTable";
import DeleteModal from "@/app/(main)/logs/PassiveModal/DeleteModal";
import InsertModal from "@/app/(main)/logs/PassiveModal/InsertModal";
import PassiveModal from "@/app/(main)/logs/components/PassiveModal";
import FormDatePicker from "@/app/_components/common/FormDatePicker";
import RefreshBtn from "@/app/_components/common/RefreshBtn";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import useResponsive from "@/libs/hooks/useResponsive";
import DataAddIcon from "@/public/images/icons/data-add-icon.svg";
import DataIcon from "@/public/images/icons/data-icon.svg";
import DataMinusIcon from "@/public/images/icons/data-minus-icon.svg";
import { confirm, openDialog } from "@/store";

interface IProps {
  totalLog: number;
  data: LogRow[];
  onChangeDate: (value: string) => void;
  schoolList: GetSchoolListResponse;
}

export default function LogTableToolbar(props: IProps) {
  const { totalLog, data, schoolList, onChangeDate } = props;

  const downDesktop = useResponsive("down", "desktop");

  const today = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(today);
  const [isHover, setIsHover] = useState(false);

  const okCount = data.filter((el) => el.logsStatus === "Ok").length;
  const noCount = data.filter((el) => el.logsStatus === "No").length;

  const handleChangeDate = (type: "reset" | "set", value?: string) => {
    if (type === "reset") {
      setDate(today);
      onChangeDate(today);
      return;
    }

    if (value != null) {
      setDate(value);
      onChangeDate(value);
    }
  };

  return (
    <Wrapper>
      <Title>
        {date === today ? `${date}(오늘)` : `${date}일`}
        {downDesktop && <br />} 총 {totalLog}개의 Row 생성&nbsp;
        {downDesktop && <br />}
        <span>
          {`(Ok :`}&nbsp;
          <span style={{ color: "#32C794" }}>{`${okCount}`}</span>
          개&nbsp;/&nbsp;
          <span>{`No :`}</span>&nbsp;
          <span style={{ color: "#F44336" }}>{`${noCount}`}</span>
          {`${`개)`}`}
        </span>
      </Title>

      <BtnWrap>
        <DataBtn
          whileHover={{ backgroundColor: "#F1F2F3" }}
          onHoverStart={() => setIsHover(true)}
          onHoverEnd={() => setIsHover(false)}
          onClick={() => setIsHover(!isHover)}
        >
          <Data />
          <span>Data 관리</span>

          <AnimatePresence>
            {isHover && (
              <HoverMenu
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <HoverItem
                  key={"first"}
                  whileHover={{ color: "#32C794" }}
                  onClick={() => openDialog(InsertModal, { schoolList })}
                >
                  <DataAddSt />
                  <span>수동 삽입</span>
                </HoverItem>
                <HoverItem
                  key={"second"}
                  whileHover={{ color: "#F44336" }}
                  onClick={() => openDialog(DeleteModal, { schoolList })}
                >
                  <DataMinusSt />
                  <span>수동 삭제</span>
                </HoverItem>
              </HoverMenu>
            )}
          </AnimatePresence>
        </DataBtn>

        <RefreshBtn
          onClick={() => handleChangeDate("reset")}
          sx={{ fontWeight: 600 }}
        />
        <FormDatePicker
          sx={(theme) => ({
            width: "100%",
            maxWidth: "150px",
            [theme.breakpoints.down("desktop")]: {
              maxWidth: "125px",
            },
          })}
          offMinDate
          value={date}
          onChange={(e) => handleChangeDate("set", e.target.value as string)}
        />
      </BtnWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(({ theme }) => {
  return {
    gap: "12px",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("desktop")]: {},
  };
});

const Title = styled(Box)(({ theme }) => {
  return {
    fontSize: 20,
    fontWeight: 600,
    display: "flex",
    color: "#747D8A",
    justifyContent: "start",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 14,
      flexWrap: "wrap",
    },
  };
});

const DataBtn = styled(motion.div)(({ theme }) => {
  return {
    gap: "8px",
    fontSize: 16,
    fontWeight: 600,
    display: "flex",
    cursor: "pointer",
    color: "#464B53",
    textAlign: "center",
    borderRadius: "8px",
    padding: "8px 12px",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid #464B53",
    [theme.breakpoints.down("desktop")]: {
      fontSize: 12,
      padding: "4px 8px",
      borderRadius: "4px",
    },
  };
});

const BtnWrap = styled(Box)(({ theme }) => {
  return {
    gap: "12px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    [theme.breakpoints.down("desktop")]: {
      gap: "6px",
    },
  };
});

const Data = styled(DataIcon)(() => {
  return {
    width: "20px",
    height: "20px",
    path: {
      stroke: "#464B53",
    },
  };
});

const DataAdd = styled(DataAddIcon)(() => ({
  width: "24px",
  height: "24px",
  path: {
    stroke: "currentColor",
  },
}));

const DataMinus = styled(DataMinusIcon)(() => ({
  width: "24px",
  height: "24px",
  path: {
    stroke: "currentColor",
  },
}));

const HoverMenu = styled(motion.div)(({ theme }) => {
  return {
    top: 44,
    left: 0,
    gap: "8px",
    zIndex: 20,
    width: "100%",
    display: "flex",
    borderRadius: "8px",
    padding: "12px 8px",
    position: "absolute",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
    boxShadow: "2px 4px 24px 0 rgba(0, 0, 0, 0.40)",
    [theme.breakpoints.down("desktop")]: {
      padding: "8px",
    },
  };
});

const HoverItem = styled(motion.div)(({ theme }) => {
  return {
    gap: "8px",
    fontSize: 16,
    padding: "4px",
    display: "flex",
    fontWeight: 500,
    cursor: "pointer",
    alignItems: "center",
    [theme.breakpoints.down("desktop")]: {
      gap: "4px",
      fontSize: 10,
    },
  };
});

const DataAddSt = styled(DataAdd)(({ theme }) => {
  return {
    [theme.breakpoints.down("desktop")]: {
      width: "16px",
      height: "16px",
    },
  };
});
const DataMinusSt = styled(DataMinus)(({ theme }) => {
  return {
    [theme.breakpoints.down("desktop")]: {
      width: "16px",
      height: "16px",
    },
  };
});
