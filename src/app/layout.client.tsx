"use client";

import { Box, styled, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

import { RootToast } from "@/app/_components/RootToast";
import theme from "@/theme";

interface IProps {
  children: ReactNode;
}

export default function ClientLayout(props: IProps) {
  const { children } = props;

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: false, prepend: false }}>
      <ThemeProvider theme={theme}>
        <ChildrenWrap>{children}</ChildrenWrap>
        <CssBaseline />
        <RootToast />
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

const ChildrenWrap = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});
