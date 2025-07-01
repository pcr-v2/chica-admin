"use client";

import { Box, styled } from "@mui/material";
import React from "react";

import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";

interface IProps {
  schoolList: GetSchoolListResponse;
}

export default function SchoolList(props: IProps) {
  const { schoolList } = props;
  return (
    <Wrapper>
      {schoolList.result?.map((el) => {
        return <div key={el.id}>{el.school_name}</div>;
      })}
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    display: "flex",
    flexDirection: "column",
    gap: "23px",
  };
});
