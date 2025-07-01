"use client";

import { Box, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

import { signIn } from "@/app/actions/auth/SignInAction";
import SignInForm from "@/app/signin/_components/SignInForm";
import BtbLogo from "@/public/images/logo/blue-logo.png";

type THandleEvent =
  | ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  | ChangeEvent<HTMLInputElement>;

export default function SignInContainer() {
  const router = useRouter();

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
        router.push("/school/list");
      } else {
        router.push("/dashboard");
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Wrapper>
      <Logo src={BtbLogo.src} alt="logo" />

      <SignInForm loginValue={loginValue} onChange={handleForm} />

      <BottomContent>
        <Btn onClick={handleSignIn}>로그인</Btn>

        <AccountWrap>
          <SpanST onClick={() => {}}>계정찾기</SpanST>
          <Divider />
          <SpanST onClick={() => router.push("/signup")}>회원가입</SpanST>
        </AccountWrap>
      </BottomContent>
      <CopyRightSpan>
        © 2025 Build the Bridge. All rights reserved.
      </CopyRightSpan>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    width: "100%",
    display: "flex",
    minHeight: "100dvh",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const Logo = styled("img")(() => {
  return {
    width: "360px",
    marginBottom: "40px",
  };
});

const BottomContent = styled(Box)(() => {
  return {
    gap: "24px",
    width: "100%",
    display: "flex",
    maxWidth: "360px",
    marginTop: "40px",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const AccountWrap = styled(Box)(() => {
  return {
    gap: "24px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

const Btn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "100%",
    color: "#fff",
    fontWeight: 500,
    maxWidth: "360px",
    cursor: "pointer",
    lineHeight: "160%",
    textAlign: "center",
    borderRadius: "8px",
    padding: "12px 24px",
    letterSpacing: "-0.32px",
    backgroundColor: "#3196ff",
  };
});

const SpanST = styled("span")(() => {
  return {
    fontSize: 14,
    fontWeight: 400,
    cursor: "pointer",
    color: "#9e9e9e",
  };
});

const Divider = styled(Box)(() => {
  return {
    width: "0.5px",
    height: "14px",
    backgroundColor: "#9e9e9e",
  };
});

const CopyRightSpan = styled("span")(() => {
  return {
    fontSize: 14,
    fontWeight: 400,
    marginTop: "32px",
    color: "#9d9d9d",
  };
});
