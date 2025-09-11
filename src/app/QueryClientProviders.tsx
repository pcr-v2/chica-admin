"use client";

import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import React, { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
  client: QueryClient;
  state?: DehydratedState | null;
}

export default function QueryClientProviders({
  children,
  client,
  state,
}: ProvidersProps) {
  return (
    <QueryClientProvider client={client}>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}

// 서버/클라이언트 공용 QueryClient 생성 함수
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 3,
        },
      },
    });
  } else {
    if (!browserQueryClient)
      browserQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 3,
          },
        },
      });
    return browserQueryClient;
  }
}
