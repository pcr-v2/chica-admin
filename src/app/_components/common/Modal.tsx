import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, styled } from "@mui/material";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal(props: IProps) {
  const { children, onClose } = props;

  return (
    <Background>
      <Content>
        {children}
        <CloseIcon onClick={onClose} />
      </Content>
    </Background>
  );
}

const Background = styled(Box)(() => {
  return {
    inset: 0,
    width: "100%",
    padding: "24px",
    display: "flex",
    minHeight: "100dvh",
    position: "absolute",
    background: "rgba(0, 0, 0, 0.40)",
  };
});

const Content = styled(Box)(() => {
  return {
    width: "100%",
    margin: "auto",
    maxWidth: "500px",
    borderRadius: "12px",
    position: "relative",
    display: "flex",
    padding: "24px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.16)",
  };
});

const CloseIcon = styled(CloseRoundedIcon)(() => {
  return {
    top: 24,
    right: 24,
    width: "24px",
    height: "24px",
    cursor: "pointer",
    position: "absolute",
  };
});
