"use client";

import { Box, styled, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

import QueryClientProviders from "@/app/QueryClientProviders";
import { RootToast } from "@/app/_components/RootToast";
import { Dialogs } from "@/store/dialog/Dialogs";
import theme from "@/theme";

interface IProps {
  children: ReactNode;
  dehydratedState: DehydratedState | null | undefined;
}

export default function ClientLayout(props: IProps) {
  const { children, dehydratedState } = props;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
          },
        },
      }),
  );

  return (
    <QueryClientProviders client={queryClient} state={dehydratedState}>
      <HydrationBoundary state={dehydratedState}>
        <AppRouterCacheProvider
          options={{ enableCssLayer: false, prepend: false }}
        >
          <ReactQueryDevtools buttonPosition="bottom-right" />
          <ThemeProvider theme={theme}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"ko"}
            >
              <Dialogs />
              <ChildrenWrap>{children}</ChildrenWrap>
            </LocalizationProvider>
            <CssBaseline />
            <RootToast />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </HydrationBoundary>
    </QueryClientProviders>
  );
}

const ChildrenWrap = styled(Box)(() => {
  return {
    flex: 1,
    flexGrow: 1,
    width: "100%",
    display: "flex",
    minHeight: "100dvh",
    alignItems: "center",
    justifyContent: "center",
  };
});
