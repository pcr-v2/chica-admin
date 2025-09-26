"use client";

import { Box, styled } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

import { GetSchoolListResponse } from "@/app/actions/school/getSchoolListAction";
import Arrow from "@/public/images/icons/sidebar/side-arrow.svg";

interface IProps {
  schoolList: GetSchoolListResponse["result"];
  selectedSchool: string | null;
  onChange: (value: string) => void;
}

export default function MasterSchoolFilter(props: IProps) {
  const { selectedSchool, onChange, schoolList } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const [label, setLabel] = useState("관리자-학교선택");

  const [isOpen, setIsOpen] = useState(false);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const toggleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen((prev) => !prev);
  };

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

  const list = schoolList?.filter(
    (el) => el.schoolStatus && el.schoolType !== "master",
  );

  return (
    <Container ref={containerRef} sx={{ zIndex: isOpen ? 999 : 0 }}>
      {/* 버튼 */}
      <Btn onClick={toggleOpen}>
        <SelectLabel>
          {selectedSchool == null ? "관리자-학교선택" : label}
        </SelectLabel>
        <ArrowImg isopen={isOpen.toString()} />
      </Btn>

      {/* Popper */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <Dropdown
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 9999,
              }}
            >
              {list?.map((el, idx) => (
                <Item
                  key={`${el}-${idx}`}
                  onClick={() => {
                    onChange(el.schoolId);
                    setLabel(`${el.schoolName}`);
                    setIsOpen(false);
                  }}
                  selected={selectedSchool === el.schoolId}
                >
                  {el.schoolName}
                </Item>
              ))}
            </Dropdown>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </Container>
  );
}

const Container = styled("div")({
  zIndex: 0,
  display: "flex",
  minWidth: "141px",
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
  minWidth: "132px",
  maxWidth: "132px",
  cursor: "pointer",
  listStyle: "none",
  padding: "4px 0px",
  borderRadius: "4px",
  textAlign: "center",
  overflow: "hidden",
  whiteSpace: "nowrap",
  justifyContent: "start",
  textOverflow: "ellipsis",
  backgroundColor: "white",
  color: selected ? "#32C794" : "#747D8A",
  "&:hover": {
    backgroundColor: "#EDFCF7",
  },
}));

const SelectLabel = styled("span")(() => {
  return {
    maxWidth: "100px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    justifyContent: "start",
    textOverflow: "ellipsis",
    backgroundColor: "#f7f8fa",
  };
});
