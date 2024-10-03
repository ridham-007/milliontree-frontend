"use client";
import React from "react";

interface CustomTextFieldProps {
  placeholder: string;
  name: string;
  className?: string;
  bgColor?: string;
  showPasswordSuffix?: boolean;
  errorMessage?: string;
  label?: string | any;
  value?: string;
  onChange?: any;
  height?: string;
  resize?: any;
  row?: any;
  backgroundColor?: boolean | undefined
}

const CustomTextField = (props: CustomTextFieldProps) => {
  const {
    placeholder,
    name,
    bgColor,
    className,
    errorMessage,
    label,
    value,
    onChange,
    height,
    resize,
    row,
    backgroundColor
  } = props;
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium text-[16px] leading-[24px] text-[#3E4654]">
        {label}
      </label>
      <div className={`relative flex items-center ${className}`}>
        <textarea
          name={name}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e: any) => onChange(e, name)}
          className={`w-full rounded-[8px] border border-[#D4D7DD] py-[10px] px-[14px] focus:outline-none 
        ${backgroundColor ? '!bg-red-100 opacity-70 !border-red-500' : '!bg-white'}`}
          style={{ height, resize }}
          rows={row || 0}
        />
        <p
          aria-live="polite"
          className="absolute left-2 top-11 font-normal text-[#FF0000]"
        >
          {errorMessage}
        </p>
      </div>
    </div>
  );
};

export default CustomTextField;
