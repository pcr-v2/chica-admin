import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import Head from "next/head";
import { ReactNode } from "react";

import QueryClientProviders from "@/app/QueryClientProviders";
import { getMe } from "@/app/actions/auth/getMe";
import ClientLayout from "@/app/layout.client";
import getQueryClient from "@/libs/getQueryClient";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `${"양치킹관리자"} | %s`,
      default: "양치킹관리자",
    },
  };
}

interface IProps {
  children: ReactNode;
}

export default async function RootLayout(props: IProps) {
  const { children } = props;

  const queryClient = getQueryClient();

  // 서버에서 getMe prefetch
  await queryClient.prefetchQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, // 5분
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body>
        <ClientLayout dehydratedState={dehydratedState}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
