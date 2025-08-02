"use client";

import { Box, InputAdornment, styled, TextField } from "@mui/material";
import { useState } from "react";

import CsSearchFilter from "@/app/(main)/cs/components/CsSearchFilter";
import Input from "@/app/_components/common/Input";
import SearchInput from "@/app/_components/common/SearchInput";
import SearchIcon from "@/public/images/icons/cs-search-icon.svg";

interface IProps {
  onClick: () => void;
}

export default function CsSearchBar(props: IProps) {
  const { onClick } = props;

  const [selected, setSelected] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  return (
    <Wrapper>
      <Box sx={{ gap: "16px", display: "flex", alignItems: "center" }}>
        <CsSearchFilter
          selectedFilter={selected}
          onChange={(value) => {
            console.log(value);
            setSelected(value);
          }}
        />

        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="검색"
        />
      </Box>

      <RegistBtn onClick={onClick}>글 작성</RegistBtn>
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
