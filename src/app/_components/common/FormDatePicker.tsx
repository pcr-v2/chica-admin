import { styled, SxProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import customDayjs from "@/utils/customDayjs";

// mui 참고
type ChangeEvent = {
  target: { value?: string | null; name?: string };
};

export type FormDatePickerProps = {
  name?: string;
  value?: string | null;
  format?: string;
  onChange?: (e: ChangeEvent) => void;
  sx?: SxProps;
  offMinDate?: boolean;
  readOnly?: boolean; // 추가
};

export default function FormDatePicker(props: FormDatePickerProps) {
  const {
    name,
    value,
    onChange,
    format = "YYYY-MM-DD",
    sx,
    offMinDate = false,
    readOnly = false,
  } = props;

  const currentYear = dayjs().year();

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
      sx={sx}
      name={name}
      format={format}
      value={realValue}
      readOnly={readOnly}
      onChange={setValue}
      slotProps={{
        textField: {
          readOnly: true,
          onKeyDown: (e) => e.preventDefault(),
        },
        popper: {
          placement: "top-end",
          modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
        },
        layout: {
          sx: {
            ".Mui-selected": {
              backgroundColor: "#32c794 !important",
              filter: "brightness(1)",
              color: "white",
              ":focus": {
                backgroundColor: "#32c794 !important",
                filter: "brightness(1)",
              },
              ":active": {
                backgroundColor: "#32c794 !important",
              },

              ":hover": {
                backgroundColor: "#32c794 !important",
              },
            },
          },
        },
      }}
      minDate={
        offMinDate
          ? customDayjs(`${currentYear}-01-01`).tz("Asia/Seoul")
          : customDayjs().tz("Asia/Seoul").add(1, "day")
      }
    />
  );
}

const CustomDatePicker = styled(DatePicker)(() => {
  return {
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#32c794", // 원하는 색상
      height: "44px !important",
    },
    "& .MuiPickersOutlinedInput-notchedOutline": {
      height: "44px !important",
      // padding: "10px 12px",
      borderColor: "transparent !important",
      "& .Mui-focused": {
        height: "44px !important",
        border: "1px solid #32C794",
      },
      "&.Mui-focused fieldset": {
        height: "44px !important",
        border: "1px solid #32C794",
        // borderColor: theme.palette.text02.main,
      },
      "&.Mui-focused:not fieldset": {
        border: "1px solid #32C794",
        // borderColor: theme.palette.text02.main,
      },
    },
    "& .MuiPickersSectionList-root": {
      padding: 0,
    },
    "& .MuiPickersInputBase-root": {
      fontSize: 14,
      padding: "10px 12px",
      border: "1px solid #d9d9d9",
      backgroundColor: "#fff",
      "&:hover fieldset": {
        borderColor: "#d9d9d9",
      },
      "& fieldset": {
        borderColor: "#d9d9d9",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #32C794",
        // outline: "1px solid #32C794",
      },
      "&.Mui-focused": {
        height: "44px !important",
        border: "1px solid #32C794 !important",
        // outline: "1px solid #32C794 !important",
      },
    },
    "& .MuiInputAdornment-root": {
      fontSize: 9,
    },
    "& .MuiOutlinedInput-root": {
      height: 44,
      "& fieldset": { height: 44 },
      "&.Mui-focused": { height: 44, "& fieldset": { height: 44 } },
    },
    "& .MuiInputBase-input": {
      padding: "10px 12px",
      lineHeight: "21px",
    },
  };
});
