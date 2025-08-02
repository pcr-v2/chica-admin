"use client";

import { Box, styled } from "@mui/material";

export type TTab = "total" | "complete" | "not";

interface IProps {
  selected: TTab;
  onChange: (value: TTab) => void;
  countedCs: {
    total: number;
    complete: number;
    not: number;
  };
}

export default function CsTab({ selected, onChange, countedCs }: IProps) {
  const tabList = [
    { label: "전체", value: "total", count: countedCs.total },
    { label: "답변완료", value: "complete", count: countedCs.complete },
    { label: "미답변", value: "not", count: countedCs.not },
  ];

  return (
    <Wrapper>
      {tabList.map(({ label, value, count }) => {
        const isActive = value === selected;

        return (
          <TabItem
            key={value}
            onClick={() => onChange(value as TTab)}
            sx={{
              backgroundColor: isActive ? "rgba(110, 219, 181, 0.12)" : "#fff",
            }}
          >
            <span style={{ color: isActive ? "#13BA81" : "#747D8A" }}>
              {label}
            </span>
            <NumberBox
              sx={{
                color: isActive ? "#fff" : "#747D8A",
                backgroundColor: isActive ? "#32C794" : "#F1F2F3",
              }}
            >
              {count}
            </NumberBox>
          </TabItem>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled(Box)({
  gap: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
});

const TabItem = styled(Box)({
  gap: "8px",
  display: "flex",
  padding: "6px 10px",
  borderRadius: "8px",
  backgroundColor: "#fff",
  cursor: "pointer",
  alignItems: "center",
});

const NumberBox = styled(Box)({
  fontSize: 18,
  fontWeight: 400,
  padding: "0px 8px",
  borderRadius: "4px",
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
});
