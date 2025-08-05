"use client";

import { Box, styled } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import Arrow from "@/public/images/icons/sidebar/side-arrow.svg";

interface IProps {
  isUpdate: boolean;
  isElementary: boolean;
  selectedGrade: number | null;
  onChange: (value: number) => void;
}

export default function StudentGradeFilter(props: IProps) {
  const { isUpdate, isElementary, selectedGrade, onChange } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const [label, setLabel] = useState("학년");

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    if (isUpdate) {
      return;
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (selectedGrade == null) {
      setLabel("학년");
    }
  }, [selectedGrade]);

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

  const list = isElementary ? [1, 2, 3, 4, 5, 6] : [1, 2, 3];

  return (
    <Container ref={containerRef} sx={{ zIndex: isOpen ? 999 : 0 }}>
      {/* 버튼 */}
      <Btn onClick={toggleOpen}>
        <span>{selectedGrade ? `${selectedGrade}학년` : "학년"}</span>
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
            {list.map((f, idx) => (
              <Item
                key={`${f}-${idx}`}
                onClick={() => {
                  onChange(f as number);
                  setLabel(`${f}학년`);
                  setIsOpen(false);
                }}
                selected={selectedGrade === f}
              >
                {f}학년
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
  minWidth: "84px",
  borderRadius: "8px",
  position: "relative",
  padding: "10px 12px",
  backgroundColor: "#f7f8fa",
});

const Btn = styled(Box)({
  gap: "6px",
  width: "100%",
  fontSize: 14,
  display: "flex",
  fontWeight: 400,
  cursor: "pointer",
  color: "#747D8A",
  lineHeight: "150%",
  alignItems: "center",
  position: "relative",
  justifyContent: "space-between",
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
  minWidth: "76px",
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
