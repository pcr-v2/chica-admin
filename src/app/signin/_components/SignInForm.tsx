"use client";

import { Box, styled } from "@mui/material";
import { ChangeEvent } from "react";

import Input from "@/app/_components/common/Input";

interface IProps {
  loginValue: { id: string; pw: string };
  onChange: (
    e:
      | ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | ChangeEvent<HTMLInputElement>,
  ) => void;
}

export default function SignInForm(props: IProps) {
  const { onChange } = props;
  const { id, pw } = props.loginValue;

  return (
    <Wrapper>
      <Input id="id" type="text" value={id} onChange={onChange} />
      <Input id="pw" type="password" value={pw} onChange={onChange} />
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "32px",
    width: "100%",
    display: "flex",
    maxWidth: "360px",
    flexDirection: "column",
  };
});
