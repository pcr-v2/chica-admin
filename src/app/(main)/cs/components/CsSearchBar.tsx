"use client";

import { Box, styled } from "@mui/material";
import { useState } from "react";

import CsSearchFilter from "@/app/(main)/cs/components/CsSearchFilter";
import SearchInput from "@/app/_components/common/SearchInput";

interface IProps {
  onClickWrite: () => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function CsSearchBar(props: IProps) {
  const {
    onClickWrite,
    selectedFilter,
    onFilterChange,
    searchValue,
    onSearchChange,
  } = props;

  return (
    <Wrapper>
      <Box sx={{ gap: "16px", display: "flex", alignItems: "center" }}>
        <CsSearchFilter
          selectedFilter={selectedFilter}
          onChange={(value) => {
            // console.log(value);
            onFilterChange(value);
          }}
        />

        <SearchInput
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="검색"
        />
      </Box>

      <RegistBtn onClick={onClickWrite}>글 작성</RegistBtn>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    gap: "16px",
    width: "100%",
    display: "flex",
    padding: "4px 0px",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

const RegistBtn = styled(Box)(() => {
  return {
    fontSize: 16,
    width: "100%",
    color: "#fff",
    fontWeight: 600,
    maxWidth: "120px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "8px",
    padding: "8px 12px",
    backgroundColor: "#32C794",
  };
});
