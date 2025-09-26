"use client";

import { Box, styled, SxProps } from "@mui/material";

import RefreshIcon from "@/public/images/icons/refresh-icon.svg";

interface IProps {
  onClick: () => void;
  sx?: SxProps;
}

export default function RefreshBtn(props: IProps) {
  const { sx, onClick } = props;

  return (
    <Wrapper sx={sx} onClick={onClick}>
      <Refresh />
      초기화
    </Wrapper>
  );
}

const Refresh = styled(RefreshIcon)<{ isopen: string }>(({ isopen }) => ({
  width: "24px",
  height: "24px",
  path: {
    fill: "#32C794",
  },
}));

const Wrapper = styled(Box)(() => {
  return {
    gap: "8px",
    fontSize: 14,
    width: "100px",
    minWidth: "100px",
    fontWeight: 400,
    display: "flex",
    cursor: "pointer",
    color: "#32C794",
    textAlign: "center",
    borderRadius: "8px",
    padding: "8px 12px",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #32C794",

    ":hover": {
      color: "#13BA81 !important",
      backgroundColor: "rgba(110, 219, 181, 0.12) !important",
    },
  };
});
