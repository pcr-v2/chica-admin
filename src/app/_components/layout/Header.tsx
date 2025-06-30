"use client";

import { Box, styled } from "@mui/material";
import React from "react";

import { GetMeResponse } from "@/app/actions/auth/getMe";

interface IProps {
  me: GetMeResponse;
}

export default function Header(props: IProps) {
  const { me } = props;

  return <Wrapper>{me?.data?.name}님</Wrapper>;
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    padding: "12px 24px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.23)",
  };
});
