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

type IProps = TextFieldProps & {
  value: string;
  showCancel?: boolean;
  maxLength?: number;
  moreheight?: string;
  readOnly?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input(props: IProps) {
  const {
    type = "text",
    value,
    onChange,
    showCancel = false,
    maxLength,
    moreheight,
    readOnly,
  } = props;

  const [showPassword, setShowPassword] = useState(type !== "password");

  function createSyntheticEvent(value: string, id: string) {
    return {
      target: { value, id } as HTMLInputElement,
    } as React.ChangeEvent<HTMLInputElement>;
  }

  return (
    <StyledTextField
      {...props}
      variant="filled"
      type={type === "password" && !showPassword ? "password" : "text"}
      value={value}
      onChange={onChange}
      autoComplete="off"
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          inputProps: {
            maxLength: maxLength,
            readOnly: props.readOnly,
          },
          disableUnderline: true,
          endAdornment: value.length > 0 && (
            <InputAdornment position="end">
              {showCancel && (
                <Cancel
                  onClick={() => onChange(createSyntheticEvent("", props.id!))}
                />
              )}

              {type === "password" &&
                (!showPassword ? (
                  <Eye onClick={() => setShowPassword(true)} />
                ) : (
                  <OffEye onClick={() => setShowPassword(false)} />
                ))}
            </InputAdornment>
          ),
        },
      }}
      sx={{
        "& input.MuiInputBase-input": {
          padding:
            moreheight !== "" && moreheight != null ? moreheight : "10px 12px",
        },
      }}
    />
  );
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& input.MuiInputBase-input": {
    fontSize: 14,
    color: "#464B53",
    padding: "10px 12px",
  },
  "& input.Mui-disabled": {
    color: "#747D8A !important", // ✅ 핵심 수정
  },
  "& .MuiFilledInput-root": {
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#d9d9d9" : "#747D8A",
    backgroundColor: "#fff",
    transition: theme.transitions.create([
      "box-shadow",
      "border-color",
      "background-color",
    ]),
    "&:hover": { backgroundColor: "#fff" },

    "&.Mui-focused": {
      borderWidth: "1px",
      backgroundColor: "#fff",
      borderColor: "#32C794",
    },
    "&.Mui-disabled": {
      backgroundColor: "#FAFAFA !important", // 기본 상태
      // borderColor: "#d9d9d9",
      color: "#747D8A !important",
    },

    "&.Mui-disabled:hover": {
      backgroundColor: "#FAFAFA !important", // 호버 시에도 동일하게
    },
    [theme.breakpoints.down("desktop")]: {
      "& input.MuiInputBase-input": {
        fontSize: 16,
        color: "#464B53",
        padding: "10px 12px",
      },
    },
  },
}));

const Cancel = styled(CancelIcon)(() => ({
  width: "24px",
  height: "24px",
  cursor: "pointer",
}));
const Eye = styled(VisibilityIcon)(() => ({ cursor: "pointer" }));
const OffEye = styled(VisibilityOffIcon)(() => ({ cursor: "pointer" }));
