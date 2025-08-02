"use client";

import { Box, styled } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";

import Header from "@/app/_components/layout/Header";
import SideBar from "@/app/_components/layout/SideBar";
import { getMe, GetMeResponse } from "@/app/actions/auth/getMe";

interface IProps {
  children: ReactNode;
}

export default function Mainlayout(props: IProps) {
  const { children } = props;

  const [me, setMe] = useState<GetMeResponse>();

  useEffect(() => {
    getMe().then(setMe);
  }, []);

  return (
    <Wrapper>
      <SideBar me={me!} />

      <RightPannel>
        <Header me={me!} />
        <ContentPage>{children}</ContentPage>
      </RightPannel>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    maxWidth: "1920px",
    minHeight: "100dvh",
  };
});

const RightPannel = styled(Box)(() => {
  return {
    gap: "14px",
    width: "100%",
    display: "flex",
    overflow: "hidden",
    padding: "0px 32px",
    flexDirection: "column",
    backgroundColor: "#F7F8FA",
    height: "calc(100dvh)",
  };
});

const ContentPage = styled(Box)(() => {
  return {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    width: "100%",
    paddingBottom: "40px",
  };
});
