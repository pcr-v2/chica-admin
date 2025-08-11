"use client";

import { Box, styled } from "@mui/material";
import React, { forwardRef, HTMLAttributes } from "react";

import DeleteIcon from "@/public/images/icons/delete-icon.svg";

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  fileType: "image" | "video";
  opacity?: number;
  fileUrl: string;
  onClickDelete: () => void;
  withOpacity?: boolean;
  isDragging?: boolean;
};

const ContentsItem = forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
  const {
    id,
    withOpacity,
    isDragging,
    style,
    fileType,
    fileUrl,
    opacity,
    onClickDelete,
    ...rest
  } = props;

  const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // 드래그 시작 이벤트 차단
    // onClickDelete();
  };

  const handleDeletePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.stopPropagation(); // 드래그 시작 시 발생하는 pointerdown 이벤트 차단
    event.preventDefault(); // 드래그 시작 시 발생하는 pointerdown 이벤트 차단
    onClickDelete();
  };

  return (
    <ItemWrap
      ref={ref}
      withOpacity={withOpacity}
      isDragging={isDragging}
      style={style}
      {...rest}
    >
      <ItemBox isDragging={isDragging}>
        {fileType === "image" && <FileImg src={fileUrl} alt="drag-preview" />}
        {fileType === "video" && (
          <FileVideo src={fileUrl} muted playsInline preload="metadata" />
        )}
      </ItemBox>

      <BottomWrap>
        <TimeSpan>00:00:00</TimeSpan>

        <Delete
          data-no-dnd
          onClick={handleDeleteClick}
          onPointerDown={handleDeletePointerDown}
        />
      </BottomWrap>
    </ItemWrap>
  );
});

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
  gap: 8,
  width: 220,
  height: 268,
  display: "flex",
  borderRadius: 16,
  alignItems: "center",
  flexDirection: "column",
  transformOrigin: "50% 50%",
  backgroundColor: "#ffffff",
  opacity: withOpacity ? 0.5 : 1,
  justifyContent: "space-between",
  cursor: isDragging ? "grabbing" : "grab",
  transform: isDragging ? "scale(1.05)" : "scale(1)",
}));

const ItemBox = styled("div", {
  shouldForwardProp: (prop) => prop !== "withOpacity" && prop !== "isDragging",
})<{
  withOpacity?: boolean;
  isDragging?: boolean;
}>(({ withOpacity, isDragging }) => ({
  width: 220,
  height: 220,
  display: "flex",
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  border: isDragging ? "2px dashed #6EDBB5" : "1px solid #8EE3C5",
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
  borderRadius: 8,
  cursor: "pointer",
  border: "1px solid #F3F3F3",
  path: {
    fill: "#747D8A",
  },
}));

const FileImg = styled("img")(() => {
  return {
    width: 200,
    height: 200,
    opacity: 1,
    borderRadius: 8,
    objectFit: "cover",
  };
});

const FileVideo = styled("video")(() => {
  return {
    width: 200,
    height: 200,
    opacity: 1,
    borderRadius: 8,
    objectFit: "cover",
  };
});
