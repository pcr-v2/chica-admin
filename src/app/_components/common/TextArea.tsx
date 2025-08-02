"use client";

import { styled, TextareaAutosize } from "@mui/material";
import { ChangeEvent } from "react";

interface IProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea(props: IProps) {
  const { value, onChange } = props;

  return (
    <TextAreaST
      value={value}
      maxLength={400}
      onChange={onChange}
      id="custom-textarea"
      name="custom-textarea"
      placeholder="내용을 입력해주세요."
    />
  );
}

const TextAreaST = styled("textarea")(() => {
  return {
    fontSize: 14,
    width: "100%",
    resize: "none",
    padding: "12px",
    fontWeight: 400,
    minHeight: "150px",
    maxHeight: "150px",
    color: "#424242",
    overflowY: "auto",
    border: "1px solid #d9d9d9",
    borderRadius: "4px",
    "&:focus": {
      border: "1px solid #32C794",
      outline: "none",
    },
  };
});
