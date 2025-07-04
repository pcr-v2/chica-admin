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
    width: "100%",
    display: "flex",
    height: "100dvh",
    overflow: "hidden",
    flexDirection: "column",
  };
});

const ContentPage = styled(Box)(() => {
  return {
    flex: 1,
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "32px 24px",
    // backgroundColor: "#fafafa",
    // minHeight: "calc(100dvh - 51px)",
  };
});
