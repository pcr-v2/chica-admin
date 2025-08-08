"use client";

import { Box, styled } from "@mui/material";
import React, { forwardRef, HTMLAttributes, ReactNode } from "react";

import DeleteIcon from "@/public/images/icons/delete-icon.svg";

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  withOpacity?: boolean;
  isDragging?: boolean;
  children?: ReactNode;
};

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ id, withOpacity, isDragging, style, ...props }, ref) => {
    return (
      <ItemContainer
        ref={ref}
        withOpacity={withOpacity}
        isDragging={isDragging}
        style={style}
        {...props}
      >
        <PreviewBox>{props.children ?? id}</PreviewBox>

        <BottomWrap>
          <TimeSpan>00:00:00</TimeSpan>
          <Delete />
        </BottomWrap>
      </ItemContainer>
    );
  },
);

export default Item;

// ---------- styled components ----------

const ItemContainer = styled("div", {
  shouldForwardProp: (prop) =>
    !["withOpacity", "isDragging"].includes(prop as string),
})<{
  withOpacity?: boolean;
  isDragging?: boolean;
}>(({ withOpacity, isDragging }) => ({
  opacity: withOpacity ? 0.5 : 1,
  transformOrigin: "50% 50%",
  height: "268px",
  width: "220px",
  borderRadius: "16px",
  cursor: isDragging ? "grabbing" : "grab",
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  justifyContent: "space-between",
  alignItems: "center",
  transform: isDragging ? "scale(1.05)" : "scale(1)",
}));

const PreviewBox = styled("div")(() => ({
  height: "220px",
  width: "220px",
  border: "1px solid blue",
  borderRadius: "16px",
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
  width: "40px",
  height: "40px",
  padding: "6px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "1px solid #F3F3F3",
  path: {
    fill: "#747D8A",
  },
}));
