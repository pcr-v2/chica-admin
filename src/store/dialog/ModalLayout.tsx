// components/common/Modal.tsx
import { Box, Dialog, DialogTitle, styled, SxProps } from "@mui/material";
import { ReactNode } from "react";

import CloseIcon from "@/public/images/icons/close-black.svg";

type BtnVariant = "outlined" | "contained";

export type ModalProps = {
  open: boolean;
  sx?: SxProps;
  title?: ReactNode;
  showCloseBtn?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  isWarn?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: BtnVariant;
  }[];
};

export default function ModalLayout(props: ModalProps) {
  const {
    sx,
    open,
    onClose,
    title,
    children,
    isWarn = false,
    actions = [],
    showCloseBtn = false,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            minWidth: "320px",
            position: "relative",
            maxWidth: "fit-content",
            borderRadius: "12px !important",
            ...sx,
          },
        },
      }}
    >
      {showCloseBtn && <Close onClick={onClose} />}

      {title && <DialogTitle>{title}</DialogTitle>}

      <Content sx={{ ...sx }}>{children}</Content>

      {actions.length > 0 && (
        <BtnWrap>
          {actions.map((action, idx) =>
            isWarn ? (
              <WarnBtn
                key={idx}
                onClick={action.onClick}
                variants={action.variant ?? "contained"}
              >
                {action.label}
              </WarnBtn>
            ) : (
              <Btn
                key={idx}
                onClick={action.onClick}
                variants={action.variant ?? "contained"}
              >
                {action.label}
              </Btn>
            ),
          )}
        </BtnWrap>
      )}
    </Dialog>
  );
}

const Content = styled(Box)(() => {
  return {
    fontSize: 20,
    width: "100%",
    display: "flex",
    fontWeight: 400,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: "24px 24px 32px",
  };
});

const BtnWrap = styled(Box)(() => {
  return {
    gap: "12px",
    widht: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0px 24px 24px",
  };
});

const Btn = styled(Box)<{ variants?: BtnVariant }>(({ variants }) => {
  return {
    fontSize: 16,
    width: "100%",
    display: "flex",
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "8px",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    color: variants === "contained" ? "#fff" : "#32C794",
    border: variants === "contained" ? "none" : "1px solid #32C794",
    backgroundColor: variants === "contained" ? "#32C794" : "#fff",
    ":hover": {
      color: variants === "contained" ? "" : "#13BA81 !important",
      backgroundColor:
        variants === "contained" ? "" : "rgba(110, 219, 181, 0.12) !important",
    },
  };
});

const WarnBtn = styled(Box)<{ variants?: BtnVariant }>(({ variants }) => {
  return {
    fontSize: 16,
    width: "100%",
    display: "flex",
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "8px",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    color: variants === "contained" ? "#fff" : "#F44336",
    border: variants === "contained" ? "none" : "1px solid #F44336",
    backgroundColor: variants === "contained" ? "#F44336" : "#fff",
  };
});

const Close = styled(CloseIcon)(() => {
  return {
    top: 10,
    right: 12,
    width: "20px",
    height: "20px",
    cursor: "pointer",
    position: "absolute",
  };
});
