import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Autocomplete, Box, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState, useMemo } from "react";

import {
  getSchoolCode,
  SchoolCodeOption,
} from "@/app/actions/school/getSchoolCode";

const AutocompleteSchool =
  Autocomplete as typeof Autocomplete<SchoolCodeOption>;

interface IProps {
  onChange: (value: SchoolCodeOption | null) => void;
  debounceTime?: number;
}

export default function SearchAutocomplete({
  onChange,
  debounceTime = 500,
}: IProps) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<SchoolCodeOption[]>([]);
  const [value, setValue] = useState<SchoolCodeOption | null>(null);

  // 디바운스 구현 (입력 멈춤 후 호출)
  const debouncedInput = useDebounce(inputValue, debounceTime);

  useEffect(() => {
    if (debouncedInput.trim() === "") {
      setOptions([]);
      return;
    }

    (async () => {
      try {
        const result = await getSchoolCode(debouncedInput);
        setOptions(result);
      } catch (error) {
        setOptions([]);
        console.error(error);
      }
    })();
  }, [debouncedInput]);

  const handleChange = (newValue: SchoolCodeOption | null) => {
    setValue(newValue);
    onChange(newValue ?? null);
  };

  return (
    <StyledAutocomplete
      disablePortal
      popupIcon={<ArrowDropDownIcon />}
      options={options}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      value={value}
      onInputChange={(e, newInput) => setInputValue(newInput)}
      onChange={(event, newValue) => handleChange(newValue)}
      noOptionsText="검색결과가 없습니다."
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.code}>
          {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="학교명을 입력하세요"
          variant="outlined"
        />
      )}
    />
  );
}

// StyledAutocomplete 스타일링
const StyledAutocomplete = styled(AutocompleteSchool)<{}>(({ theme }) => ({
  width: "100%",
  maxWidth: "400px",
  "& .MuiInputBase-root": {
    width: "100%",
    minHeight: 52,
    borderRadius: 4,
    "& fieldset": {
      borderColor: `${theme.palette.grey[400]} !important`,
    },
    "&:hover fieldset": {
      borderColor: `${theme.palette.grey[400]} !important`,
    },
    "&.Mui-focused fieldset": {
      borderColor: `#3196ff !important`,
    },
  },
}));

// 커스텀 훅: debounce (500ms 기본)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
