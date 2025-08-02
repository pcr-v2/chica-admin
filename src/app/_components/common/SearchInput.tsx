"use client";

import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  InputAdornment,
  styled,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useState } from "react";

import SearchIcon from "@/public/images/icons/cs-search-icon.svg";

type IProps = TextFieldProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchInput(props: IProps) {
  const { type = "text", value, onChange } = props;

  function createSyntheticEvent(value: string, id: string) {
    return {
      target: { value, id } as HTMLInputElement,
    } as React.ChangeEvent<HTMLInputElement>;
  }

  return (
    <StyledTextField
      {...props}
      variant="filled"
      type="text"
      value={value}
      onChange={onChange}
      autoComplete="off"
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="end">
              <SearchIconSt />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& input.MuiInputBase-input": {
    fontSize: 14,
    fontWeight: 400,
    color: "#464B53",
    padding: "10px 12px 10px 6px",
  },
  "& .MuiFilledInput-root": {
    padding: 0,
    borderRadius: 8,
    overflow: "hidden",
    border: "0px solid",
    backgroundColor: "#F7F8FA",
    borderColor: theme.palette.mode === "light" ? "#d9d9d9" : "#747D8A",
    transition: theme.transitions.create([
      "box-shadow",
      "border-color",
      "background-color",
    ]),
    "&:hover": { backgroundColor: "#F7F8FA" },

    "&.Mui-focused": {
      borderWidth: "0px",
      borderColor: "#32C794",
      backgroundColor: "#fff",
      outline: "1px solid #32C794",
    },
  },
}));

const SearchIconSt = styled(SearchIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "18px",
  height: "18px",
  path: {
    fill: "#747D8A",
  },
}));
