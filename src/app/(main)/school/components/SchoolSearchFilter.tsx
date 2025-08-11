"use client";

import { Box, styled } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import Arrow from "@/public/images/icons/sidebar/side-arrow.svg";

type TFilter = {
  label: string;
  value: string;
};

const filterList: TFilter[] = [
  { label: "학교명", value: "schoolname" },
  { label: "담당자", value: "teachername" },
  { label: "이메일", value: "email" },
];

interface IProps {
  selectedFilter: string;
  onChange: (value: string) => void;
}

export default function SchoolSearchFilter(props: IProps) {
  const { selectedFilter, onChange } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // ✅ 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Container ref={containerRef} sx={{ zIndex: isOpen ? 999 : 0 }}>
      {/* 버튼 */}
      <Btn onClick={toggleOpen}>
        <span>{filterList.find((f) => f.value === selectedFilter)?.label}</span>
        <ArrowImg isopen={isOpen.toString()} />
      </Btn>

      {/* Popper */}
      <AnimatePresence>
        {isOpen && (
          <Dropdown
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {filterList.map((f, idx) => (
              <Item
                key={`${f.value}-${idx}`}
                onClick={() => {
                  onChange(f.value);
                  setIsOpen(false);
                }}
                selected={selectedFilter === f.value}
              >
                {f.label}
              </Item>
            ))}
          </Dropdown>
        )}
      </AnimatePresence>
    </Container>
  );
}

const Container = styled("div")({
  zIndex: 0,
  display: "flex",
  borderRadius: "8px",
  position: "relative",
  padding: "10px 12px",
  backgroundColor: "#f7f8fa",
});

const Btn = styled(Box)({
  gap: "6px",
  fontSize: 14,
  display: "flex",
  fontWeight: 400,
  cursor: "pointer",
  color: "#747D8A",
  lineHeight: "150%",
  alignItems: "center",
  position: "relative",
});

const ArrowImg = styled(Arrow)<{ isopen: string }>(({ isopen }) => ({
  width: "20px",
  height: "20px",
  path: {
    fill: "#747D8A",
  },
  transition: "transform 0.2s ease-in-out",
  transform: `rotate(${isopen === "true" ? 0 : 180}deg)`,
}));

const Dropdown = styled(motion.ul)(() => ({
  top: 41,
  left: 0,
  zIndex: 9,
  gap: "8px",
  padding: "4px",
  display: "flex",
  marginTop: "10px",
  overflow: "hidden",
  position: "absolute",
  borderRadius: "4px 0px",
  flexDirection: "column",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  boxShadow: "2px 4px 24px 0 rgba(0, 0, 0, 0.40)",
}));

const Item = styled("li")<{ selected: boolean }>(({ selected }) => ({
  zIndex: 999,
  fontSize: 14,
  fontWeight: 400,
  minWidth: "78px",
  cursor: "pointer",
  listStyle: "none",
  padding: "4px 0px",
  borderRadius: "4px",
  textAlign: "center",
  backgroundColor: "white",
  color: selected ? "#32C794" : "#747D8A",
  "&:hover": {
    backgroundColor: "#EDFCF7",
  },
}));
