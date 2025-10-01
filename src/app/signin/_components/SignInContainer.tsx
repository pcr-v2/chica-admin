"use client";

import { Box, styled } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

import { signIn } from "@/app/actions/auth/SignInAction";
import SignInForm from "@/app/signin/_components/SignInForm";
import AdminLogo from "@/public/images/logo/admin-logo.png";

type THandleEvent =
  | ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  | ChangeEvent<HTMLInputElement>;

export default function SignInContainer() {
  const router = useRouter();

  const currentYear = dayjs().get("year");

  const [loginValue, setLoginValue] = useState({ id: "", pw: "" });

  const handleForm = (e: THandleEvent) => {
    const { value, id } = e.target;

    if (id === "id") {
      setLoginValue({ ...loginValue, id: value });
      return;
    }

    setLoginValue({ ...loginValue, pw: value });
  };

  const handleSignIn = async () => {
    const result = await signIn(loginValue);
    if (result.code === "SUCCESS") {
      // 로그인 성공 시 페이지 이동 등
      toast.success("로그인 되었습니다.");

      if (result.type === "master") {
        router.push("/logs");
      } else {
        router.push("/dashboard");
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Wrapper>
      <Logo src={AdminLogo.src} alt="logo" />

      <SignInForm
        loginValue={loginValue}
        onChange={handleForm}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSignIn();
        }}
      />

      <BottomContent>
        <Btn onClick={handleSignIn}>로그인</Btn>
      </BottomContent>

      <CopyRightSpan>
        © {currentYear} BUILD THE BRIDGE. All rights reserved.
      </CopyRightSpan>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    minHeight: "100dvh",
    padding: "0px 24px",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const Logo = styled("img")(() => {
  return {
    width: "100%",
    maxWidth: "240px",
    marginBottom: "64px",
  };
});

const BottomContent = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    maxWidth: "360px",
    marginTop: "60px",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const Btn = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    color: "#fff",
    fontWeight: 600,
    maxWidth: "360px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "12px 20px",
    backgroundColor: "#32C794",
  };
});

const CopyRightSpan = styled("span")(() => {
  return {
    fontSize: 14,
    fontWeight: 400,
    marginTop: "32px",
    color: "#9d9d9d",
    textAlign: "center",
  };
});
