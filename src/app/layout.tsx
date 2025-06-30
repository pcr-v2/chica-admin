import { ReactNode } from "react";

import ClientLayout from "@/app/layout.client";

import "./globals.css";

interface IProps {
  children: ReactNode;
}

export default function RootLayout(props: IProps) {
  const { children } = props;

  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
