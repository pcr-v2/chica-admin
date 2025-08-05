"use client";

import { Box, styled } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import Arrow from "@/public/images/icons/sidebar/side-arrow.svg";

interface IProps {
  selectedCount: number;
  onChange: (value: number) => void;
  options?: number[]; // 옵션 배열 (기본값 제공)
}

export default function ContentsViewCountFilter({
  selectedCount,
  onChange,
  options = [10, 30, 100],
}: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

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
      <Btn onClick={toggleOpen}>
        <span>{selectedCount}</span>
        <ArrowImg isopen={isOpen.toString()} />
      </Btn>

      <AnimatePresence>
        {isOpen && (
          <Dropdown
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((count, idx) => (
              <Item
                key={`${count}-${idx}`}
                onClick={() => {
                  onChange(count);
                  setIsOpen(false);
                }}
                selected={selectedCount === count}
              >
                {count}
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
  transform: `rotate(${isopen === "true" ? 180 : 0}deg)`,
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
  borderRadius: "4px 0px",
  position: "absolute",
  flexDirection: "column",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  boxShadow: "2px 4px 24px 0 rgba(0, 0, 0, 0.40)",
}));

const Item = styled("li")<{ selected: boolean }>(({ selected }) => ({
  zIndex: 999,
  fontSize: 14,
  fontWeight: 400,
  minWidth: "56px",
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
