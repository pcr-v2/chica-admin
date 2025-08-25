"use client";

import { Box, styled } from "@mui/material";
import React, {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

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
    withOpacity,
    isDragging,
    style,
    fileType,
    fileUrl,
    opacity,
    onClickDelete,
    ...rest
  } = props;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDuration, setVideoDuration] = useState<string>("");

  // ✅ 영상 길이 계산
  useEffect(() => {
    if (fileType === "video" && videoRef.current) {
      const video = videoRef.current;
      const handleLoadedMetadata = () => {
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60)
          .toString()
          .padStart(2, "0");
        setVideoDuration(`${minutes}분 ${seconds}초`);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [fileType]);

  // ✅ 이미지 확장자 추출
  const getFileExtension = () => {
    try {
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      const ext = pathname.split(".").pop();
      return ext ? ext.toUpperCase() : "";
    } catch {
      const parts = fileUrl.split(".");
      return parts[parts.length - 1].toUpperCase();
    }
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleDeletePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
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
        {fileType === "image" && <FileImg src={fileUrl} alt="preview" />}
        {fileType === "video" && (
          <FileVideo
            ref={videoRef}
            src={fileUrl}
            muted
            playsInline
            preload="metadata"
          />
        )}
      </ItemBox>

      <BottomWrap>
        <TimeSpan>
          {fileType === "video" ? `영상 (${videoDuration})` : "이미지"}
        </TimeSpan>

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
// styled-components
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

const ItemBox = styled("div")<{
  withOpacity?: boolean;
  isDragging?: boolean;
}>(({ isDragging }) => ({
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
  color: "#747D8A",
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

const FileImg = styled("img")(() => ({
  width: 200,
  height: 200,
  opacity: 1,
  borderRadius: 8,
  objectFit: "cover",
}));

const FileVideo = styled("video")(() => ({
  width: 200,
  height: 200,
  opacity: 1,
  borderRadius: 8,
  objectFit: "cover",
}));
