"use client";

import { Box, styled } from "@mui/material";
import React, { forwardRef, HTMLAttributes } from "react";

import DeleteIcon from "@/public/images/icons/delete-icon.svg";

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  withOpacity?: boolean;
  isDragging?: boolean;
};

const ContentsItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ id, withOpacity, isDragging, style, ...props }, ref) => {
    return (
      <ItemWrap
        ref={ref}
        withOpacity={withOpacity}
        isDragging={isDragging}
        style={style}
        {...props}
      >
        <ItemBox>{id}</ItemBox>

        <BottomWrap>
          <TimeSpan>00:00:00</TimeSpan>
          <Delete />
        </BottomWrap>
      </ItemWrap>
    );
  },
);

export default ContentsItem;

// -------------------------------------
// 🧱 styled components
// -------------------------------------

const ItemWrap = styled("div", {
  shouldForwardProp: (prop) => prop !== "withOpacity" && prop !== "isDragging",
})<{
  withOpacity?: boolean;
  isDragging?: boolean;
}>(({ withOpacity, isDragging }) => ({
  opacity: withOpacity ? 0.5 : 1,
  transformOrigin: "50% 50%",
  height: 268,
  width: 220,
  borderRadius: 16,
  cursor: isDragging ? "grabbing" : "grab",
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  justifyContent: "space-between",
  alignItems: "center",
  transform: isDragging ? "scale(1.05)" : "scale(1)",
}));

const ItemBox = styled("div")(() => ({
  height: 220,
  width: 220,
  borderRadius: 16,
  border: "1px solid blue",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const BottomWrap = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const TimeSpan = styled("span")(() => ({
  fontSize: 18,
  fontWeight: 400,
  color: "#D5D7DB",
}));

const Delete = styled(DeleteIcon)(() => ({
  width: 40,
  height: 40,
  padding: 6,
  cursor: "pointer",
  borderRadius: 8,
  border: "1px solid #F3F3F3",
  path: {
    fill: "#747D8A",
  },
}));
