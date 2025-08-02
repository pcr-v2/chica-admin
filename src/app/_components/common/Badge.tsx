"use client";

import { Chip, styled } from "@mui/material";

type StatusType = "ANSWERED" | "UNANSWERED" | "DELETED";

interface IProps {
  label: string;
  status: StatusType;
}

export default function Badge(props: IProps) {
  const { label, status } = props;

  return <ChipST label={label} status={status} />;
}

const ChipST = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: StatusType }>(({ status }) => {
  let backgroundColor = "#999";
  let textColor = "#fff";

  switch (status) {
    case "ANSWERED":
      backgroundColor = "#EBFAFF"; // 초록
      textColor = "#48A4FF";
      break;
    case "UNANSWERED":
      backgroundColor = "#F1F2F3"; // 주황
      textColor = "#ACB3BC";
      break;
    case "DELETED":
      backgroundColor = "#F44336"; // 빨강
      textColor = "#fff";
      break;
  }

  return {
    fontSize: 16,
    width: "80px",
    fontWeight: 600,
    backgroundColor,
    color: textColor,
    "& .MuiChip-label": {
      padding: "4px 12px",
    },
  };
});
