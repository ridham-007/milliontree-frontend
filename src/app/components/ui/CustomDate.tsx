"use client";
import React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { Box } from "@mui/material";
interface InputFieldProps {
  className?: string;
  bgColor?: string;
  errorMessage?: string;
  value?: string;
  label?: string | any;
  onChange?: any;
  disabled?: boolean;
  inputCss?: any;
  minDate?: any;
}

const CustomDate = (props: InputFieldProps) => {
  const { className, label, onChange, value, disabled, inputCss, minDate } =
    props;

  return (
    <div className="flex flex-col w-full">
      <label className="font-medium text-[16px] leading-[24px] text-[#3E4654]">
        {label}
      </label>
      <Box
        className={`relative flex items-center w-full ${className}`}
        sx={{
          "& .MuiStack-root": {
            width: "100%",
            paddingTop: '0px',
          },
          "& .css-qgk9ur-MuiStack-root": {
            overflow: "hidden",
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={["DatePicker"]}
            sx={{
              ".MuiOutlinedInput-root": {
                width: "100%",
              },
              ".MuiFormControl-root": {
                ...inputCss,
                width: "100%",
              },
              ".MuiOutlinedInput-input ": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
                outline: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <DatePicker
              value={value ? dayjs(value) : null}
              onChange={(newValue: Dayjs | null) => {
                const formattedValue = newValue
                  ? dayjs(newValue).format("YYYY-MM-DD")
                  : "";
                onChange(formattedValue);
              }}
              disabled={disabled}
              minDate={minDate ? dayjs() : undefined}
              sx={{
                ".MuiOutlinedInput-input ": {
                  paddingY: "12.5px",
                  borderRadius: disabled ? "8px" : "8px",
                },
                ".MuiButtonBase-root .MuiPickersDay-root.Mui-selected": {
                  background: "red",
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
    </div>
  );
};

export default CustomDate;
