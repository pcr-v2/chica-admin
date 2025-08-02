"use client";

import { Box, styled } from "@mui/material";

interface TabItem<T extends string> {
  label: string;
  value: T;
  count: number;
}

interface Props<T extends string> {
  selected: T;
  onChange: (value: T) => void;
  tabList: readonly TabItem<T>[]; // ← 요거만 바꿔주면 끝
}

export default function CountTab<T extends string>({
  selected,
  onChange,
  tabList,
}: Props<T>) {
  return (
    <Wrapper>
      {tabList.map(({ label, value, count }) => {
        const isActive = value === selected;

        return (
          <TabItemBox
            key={value}
            onClick={() => onChange(value)}
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
          </TabItemBox>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled(Box)({
  gap: "16px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
});

const TabItemBox = styled(Box)({
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
