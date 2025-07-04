"use client";

import { AddRounded } from "@mui/icons-material";
import { Box, styled } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

import SchoolAddForm from "@/app/(main)/school/list/SchoolAddForm";
import Modal from "@/app/_components/common/Modal";
import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import customDayjs from "@/utils/customDayjs";

interface IProps {
  schoolList: GetSchoolListResponse;
}

export default function SchoolList(props: IProps) {
  const { schoolList } = props;

  const [open, setOpen] = useState(false);

  return (
    <Wrapper>
      <TopContent>
        <CountText>등록된 학교 {schoolList.result?.length}개</CountText>

        <AddSchool onClick={() => setOpen(true)}>
          <AddRounded sx={{ color: "#fff", width: "24px" }} />
          학교 추가
        </AddSchool>
      </TopContent>
      <Divider />

      <ListWrap>
        {schoolList.result?.map((el) => {
          return (
            <SingleRow key={el.id}>
              <Box sx={{}}>{el.school_name}</Box>
              <Box sx={{}}>{el.manager_name}</Box>
              <Box sx={{}}>{el.manager_email}</Box>
              <Box sx={{}}>{el.manager_phone}</Box>
              <Box sx={{}}>{el.login_id}</Box>
              <Box sx={{}}>
                계약 종료일 : {customDayjs(el.end_at).format("YYYY-MM-DD")}
              </Box>
              <Box sx={{}}>{el.school_status.toString()}</Box>
            </SingleRow>
          );
        })}
      </ListWrap>

      {open && (
        <Modal
          children={<SchoolAddForm onSuccess={() => setOpen(false)} />}
          onClose={() => setOpen(false)}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    borderRadius: "12px",
    padding: "24px",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    border: "1px solid #e0e0e0",
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
  };
});

const TopContent = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

const CountText = styled(Box)(() => {
  return {
    fontSize: 20,
    fontWeight: 500,
    color: "#212121",
    lineHeight: "160%",
    letterSpacing: "-0.32px",
  };
});

const AddSchool = styled(Box)(() => {
  return {
    gap: "8px",
    fontSize: 16,
    color: "#fff",
    fontWeight: 700,
    display: "flex",
    cursor: "pointer",
    lineHeight: "160%",
    padding: "8px 12px",
    borderRadius: "8px",
    alignItems: "center",
    letterSpacing: "-0.18px",
    backgroundColor: "#3196ff",
  };
});

const ListWrap = styled(Box)(() => {
  return {
    gap: "12px",
    width: "100%",
    padding: "24px",
    display: "flex",
    borderRadius: "12px",
    flexDirection: "column",
    border: "1px solid red",
  };
});

const Divider = styled(Box)(() => {
  return {
    width: "100%",
    height: "1px",
    margin: "24px 0px",
    backgroundColor: "#e0e0e0",
  };
});

const SingleRow = styled(Box)(() => {
  return {
    width: "100%",
    border: "1px solid red",
    padding: "12px",
    gap: "12px",
    display: "flex",
    alignItems: "center",
  };
});
