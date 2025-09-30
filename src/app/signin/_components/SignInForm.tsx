"use client";

import { Box, styled } from "@mui/material";
import { ChangeEvent, KeyboardEvent } from "react";

import Input from "@/app/_components/common/Input";

interface IProps {
  loginValue: { id: string; pw: string };
  onChange: (
    e:
      | ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | ChangeEvent<HTMLInputElement>,
  ) => void;

  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}

export default function SignInForm(props: IProps) {
  const { onChange, onKeyDown } = props;
  const { id, pw } = props.loginValue;

  return (
    <Wrapper>
      <Input
        moreheight="17px 14px"
        id="id"
        type="text"
        value={id}
        onChange={onChange}
        placeholder="아이디"
      />
      <Input
        moreheight="17px 14px"
        id="pw"
        type="password"
        value={pw}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="비밀번호"
      />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "20px",
    width: "100%",
    display: "flex",
    maxWidth: "360px",
    flexDirection: "column",
  };
});
