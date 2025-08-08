import { styled } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect } from "react";

import CloseBlackIcon from "@/public/images/icons/close-black.svg";
import CloseIcon from "@/public/images/icons/close-green.png";

interface IProps {
  open: boolean;
  isDelete?: boolean;
  maxWidth?: number;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal(props: IProps) {
  const { children, onClose, open, maxWidth = 500, isDelete } = props;

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Background
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Content
            style={{
              maxWidth,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {children}
            {isDelete ? (
              <CloseDelete onClick={onClose} />
            ) : (
              <CloseIconSt src={CloseIcon.src} onClick={onClose} />
            )}
          </Content>
        </Background>
      )}
    </AnimatePresence>
  );
}

const Background = styled(motion.div)(() => {
  return {
    inset: 0,
    width: "100%",
    padding: "24px",
    display: "flex",
    minHeight: "100dvh",
    position: "absolute",
    background: "rgba(0, 0, 0, 0.60)",
  };
});

const Content = styled(motion.div)(() => {
  return {
    width: "100%",
    margin: "auto",
    display: "flex",
    borderRadius: "12px",
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.16)",
  };
});

const CloseIconSt = styled("img")(() => {
  return {
    top: 17,
    right: 12,
    width: "28px",
    height: "28px",
    cursor: "pointer",
    position: "absolute",
    path: {
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
    },
  };
});

const CloseDelete = styled(CloseBlackIcon)(() => ({
  top: 18,
  right: 16,
  width: "24px",
  height: "24px",
  cursor: "pointer",
  position: "absolute",
  path: {
    fill: "#747D8A",
  },
}));
