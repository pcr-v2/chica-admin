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
  defaultSchoolName?: string; // ✅ 추가
}

export default function SearchAutocomplete(props: IProps) {
  const { onChange, debounceTime = 500, defaultSchoolName } = props;

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
  // console.log("defaultSchoolName", defaultSchoolName);
  useEffect(() => {
    if (!defaultSchoolName) return;

    (async () => {
      try {
        const result = await getSchoolCode(defaultSchoolName);
        const matched = result.find((school: any) =>
          school.name.includes(defaultSchoolName),
        );

        // ✅ 이미 동일한 값이 세팅돼 있다면 skip
        if (
          matched &&
          (value?.code !== matched.code || inputValue !== defaultSchoolName)
        ) {
          setValue(matched); // value (객체) 설정
          setInputValue(defaultSchoolName); // inputValue 문자열 설정
          onChange(matched); // 외부로 전달
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [defaultSchoolName]);

  return (
    <StyledAutocomplete
      disablePortal
      popupIcon={null}
      clearIcon={null}
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        const [before] = option.name.split("(");
        return before.trim();
      }}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      value={value}
      onInputChange={(e, newInput) => setInputValue(newInput)}
      onChange={(event, newValue) => handleChange(newValue)}
      noOptionsText="검색결과가 없습니다."
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 28], // [x축, y축] — 아래로 8px 띄우기
              },
            },
          ],
        },
        listbox: {
          sx: {
            padding: "12px",
            textAlign: "start",
            backgroundColor: "#fff",
            "& li": {
              padding: "4px 8px",
              borderRadius: "8px",
              justifyContent: "start",
              "&:hover": {
                color: "#13BA81 !important",
                backgroundColor: "rgba(110, 219, 181, 0.12) !important",
              },
              "&.Mui-focused": {
                color: "#13BA81 !important",
                backgroundColor: "rgba(110, 219, 181, 0.12) !important",
              },
            },
          },
        },
      }}
      renderOption={(props, option) => {
        const [before, ...afterParts] = option.name.split("(");
        const after = afterParts.length ? "(" + afterParts.join("(") : "";

        return (
          <Box
            component="li"
            {...props}
            key={`${option.code}+${option.name}`}
            sx={{
              gap: "4px",
              width: "100%",
              display: "flex",
              justifyContent: "start",
            }}
          >
            <Box
              key={`${option.code}+${option.name}-${option.schoolAnniversary}`}
              sx={{
                whiteSpace: "nowrap",
                flexShrink: 0, // ✅ 줄이지 마
              }}
            >
              {before}
            </Box>
            {after && (
              <Box
                key={`${option.code}+${option.name}+${option.officeCode}`}
                sx={{
                  fontSize: 12,
                  color: "#747D8A",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flexGrow: 1, // ✅ 남는 공간 다 차지
                  minWidth: 0, // ✅ 필수: ellipsis 작동 조건
                }}
              >
                {after}
              </Box>
            )}
          </Box>
        );
      }}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          placeholder="학교명을 입력하세요"
          variant="outlined"
        />
      )}
    />
  );
}

// StyledAutocomplete 스타일링
const StyledAutocomplete = styled(AutocompleteSchool)(({ theme }) => ({
  width: "100%",
  height: "61px !important",
  borderRadius: "8px !important",
  "& .MuiAutocomplete-root": {
    borderRadius: "8px !important",
  },

  "& .MuiOutlinedInput-root": {
    height: "41px !important",
    minHeight: "41px !important",
    borderRadius: "8px !important",
    padding: "0 !important",

    "& .MuiAutocomplete-input": {
      height: "71px !important",
      padding: "30px 12px 10px", // 글씨 수직 정렬 맞춤
    },

    "& fieldset": {
      minHeight: "61px !important",
      borderRadius: "8px !important",
      borderColor: `#d9d9d9 !important`,
    },

    "&:hover fieldset": {
      borderRadius: "8px !important",
      borderColor: `#d9d9d9 !important`,
    },

    "&.Mui-focused fieldset": {
      borderRadius: "8px !important",
      borderColor: `#32C794 !important`,
    },
  },

  "&.MuiAutocomplete-hasPopupIcon .MuiOutlinedInput-root": {
    borderRadius: "8px !important",
  },

  "&.MuiAutocomplete-hasClearIcon .MuiOutlinedInput-root": {
    paddingRight: "36px !important", // 아이콘 공간 확보
    borderRadius: "8px !important",
  },

  // popup icon 자체 크기 줄이고 싶을 때
  "& .MuiAutocomplete-popupIndicator": {
    // padding: "0 6px",
    // fontSize: "20px",
  },

  // clear icon 스타일 조정
  "& .MuiAutocomplete-clearIndicator": {
    // padding: "0 6px",
    // fontSize: "20px",
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& input.MuiInputBase-input": {
    fontSize: 14,
    color: "#464B53",
    padding: "10px 12px",
  },
  minHeight: "61px !important",

  "& .MuiFilledInput-root": {
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#d9d9d9" : "#747D8A",
    backgroundColor: "#fff",
    transition: theme.transitions.create([
      "box-shadow",
      "border-color",
      "background-color",
    ]),
    "&:hover": { backgroundColor: "#fff" },

    "&.Mui-focused": {
      borderWidth: "1px",
      backgroundColor: "#fff",
      borderColor: "#32C794",
    },
  },
}));
