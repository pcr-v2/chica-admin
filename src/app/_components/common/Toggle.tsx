"use client";

import { FormControlLabel, styled, Switch, SwitchProps } from "@mui/material";

import Icon from "@/public/images/icons/toggle-icon.svg";

interface IProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Toggle = (props: IProps) => {
  const { label, checked, onChange } = props;

  return (
    <FormControlLabel
      control={
        <IOSSwitch
          sx={{ m: 1 }}
          checked={checked ?? true}
          onChange={(e) => onChange?.(e.target.checked)}
        />
      }
      label={label}
      sx={{ margin: 0 }}
    />
  );
};

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 56,
  height: 30,
  padding: 0,
  "&.MuiSwitch-root": {
    margin: 0,
  },
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 3,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(25px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#32C794",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
    "&.Mui-checked .MuiSwitch-thumb::after": {
      opacity: 1,
      transform: "translate(-50%, -50%) scale(1)",
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 24,
    height: 24,
    position: "relative", // ✅ 이 줄 추가

    "&::after": {
      content: '""',
      zIndex: 4,
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "24px",
      height: "24px",
      backgroundImage: 'url("/images/icons/toggle-icon.svg")', // ✅ 수정된 부분
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
      transform: "translate(-50%, -50%) scale(0.8)",
      opacity: 0,
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 36 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));
