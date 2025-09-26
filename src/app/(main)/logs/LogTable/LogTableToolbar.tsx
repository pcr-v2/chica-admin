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

  const today = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(today);
  const [isHover, setIsHover] = useState(false);

  const okCount = data.filter((el) => el.logsStatus === "Ok").length;
  const noCount = data.filter((el) => el.logsStatus === "No").length;

  const handleChangeDate = (type: "reset" | "set", value?: string) => {
    if (type === "reset") {
      setDate("");
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
        {date === today ? `${date}(오늘)` : `${date}일`} 총 {totalLog}개의 row가
        생성되었습니다.&nbsp;
        {`(Ok :`}&nbsp;
        <span style={{ color: "#32C794" }}>{`${okCount}`}</span>
        개&nbsp;/&nbsp;
        <span>{`No :`}</span>&nbsp;
        <span style={{ color: "#F44336" }}>{`${noCount}`}</span>
        {`${`개)`}`}
      </Title>

      <BtnWrap>
        <DataBtn
          whileHover={{ backgroundColor: "#F1F2F3" }}
          onHoverStart={() => setIsHover(true)}
          onHoverEnd={() => setIsHover(false)}
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
                  <DataAdd />
                  <span>수동 삽입</span>
                </HoverItem>
                <HoverItem
                  key={"second"}
                  whileHover={{ color: "#F44336" }}
                  onClick={() => openDialog(DeleteModal, { schoolList })}
                >
                  <DataMinus />
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
          sx={{ width: "100%", maxWidth: "150px" }}
          offMinDate
          value={date}
          onChange={(e) => handleChangeDate("set", e.target.value as string)}
        />
      </BtnWrap>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

const Title = styled(Box)({
  fontSize: 20,
  fontWeight: 600,
  display: "flex",
  color: "#747D8A",
  justifyContent: "start",
});

const DataBtn = styled(motion.div)(() => {
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
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    gap: "12px",
    display: "flex",
    alignItems: "center",
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

const HoverMenu = styled(motion.div)(() => {
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
  };
});

const HoverItem = styled(motion.div)(() => {
  return {
    gap: "8px",
    fontSize: 16,
    padding: "4px",
    display: "flex",
    fontWeight: 500,
    cursor: "pointer",
    alignItems: "center",
  };
});
