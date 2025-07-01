import { styled, SxProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useRef } from "react";

import customDayjs from "@/utils/customDayjs";

// mui 참고
type ChangeEvent = {
  target: { value?: string | null; name?: string };
};

export type FormDatePickerProps = {
  name?: string;
  value?: string | null;
  onChange?: (e: ChangeEvent) => void;
  sx?: SxProps;
};

export default function FormDatePicker(props: FormDatePickerProps) {
  const { name, value, onChange, sx } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const realValue = !value ? null : customDayjs(value).tz("Asia/Seoul");

  const setValue = (value: customDayjs.Dayjs | null) => {
    onChange?.({
      target: {
        value: value?.format("YYYY-MM-DD") ?? null,
        name,
      },
    });
  };

  return (
    <CustomDatePicker
      name={name}
      format={"YYYY-MM-DD"}
      value={realValue}
      onChange={setValue}
      // sx={sx}
    />
  );
}

const CustomDatePicker = styled(DatePicker)(() => {
  return {
    "& .MuiPickersSectionList-root": {
      padding: 0,
    },
    "& .MuiPickersInputBase-root": {
      "&:hover fieldset": {
        borderColor: "rgba(0,0,0,0.3)",
      },
      "& fieldset": {
        borderColor: "rgba(0,0,0,0.3)",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #3196ff",
      },
      padding: "12px",
      fontSize: 16,
      backgroundColor: "#fff",
    },
    "& .MuiInputAdornment-root": {
      fontSize: 9,
    },
  };
});
