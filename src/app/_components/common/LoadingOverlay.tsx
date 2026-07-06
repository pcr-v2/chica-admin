"use client";

import { Box, CircularProgress, styled } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

interface IProps {
  open: boolean;
  label?: string;
}

export default function LoadingOverlay(props: IProps) {
  const { open, label = "데이터를 불러오는 중입니다." } = props;

  return (
    <AnimatePresence>
      {open && (
        <Overlay
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LoadingBox
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <CircularProgress size={36} thickness={4} color="success" />
            <LoadingText>{label}</LoadingText>
          </LoadingBox>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

const Overlay = styled(motion.div)(() => ({
  inset: 0,
  zIndex: 10,
  display: "flex",
  position: "absolute",
  alignItems: "center",
  borderRadius: "12px",
  pointerEvents: "none",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.72)",
}));

const LoadingBox = styled(motion.div)(() => ({
  gap: "12px",
  display: "flex",
  padding: "18px 20px",
  alignItems: "center",
  borderRadius: "12px",
  flexDirection: "column",
  backgroundColor: "rgba(255, 255, 255, 0.92)",
  boxShadow: "0 10px 30px rgba(70, 75, 83, 0.12)",
}));

const LoadingText = styled(Box)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  color: "#464B53",
  [theme.breakpoints.down("desktop")]: {
    fontSize: 14,
  },
}));
