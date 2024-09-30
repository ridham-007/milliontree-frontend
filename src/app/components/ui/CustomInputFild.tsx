"use client";
import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { GoEye, GoEyeClosed } from "react-icons/go";
interface InputFieldProps {
  placeholder: string;
  type: string;
  name: string;
  className?: string;
  bgColor?: string;
  showPasswordSuffix?: boolean;
  errorMessage?: string;
  onChange?: any;
  value?: string;
  label?: string | any;
  maxlength?: any;
  active?: boolean;
  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: string;
  boxBorder?: boolean;
  amount?: any;
}

const InputField = (props: InputFieldProps) => {
  const {
    placeholder,
    name,
    type,
    bgColor,
    className,
    showPasswordSuffix,
    onChange,
    value,
    label,
    active,
    maxlength,
    readOnly,
    min,
    max,
    step,
    boxBorder,
    amount
  } = props;
  const [viewPassword, setViewPassword] = useState<boolean>(
    !showPasswordSuffix
  );
 
  const borderColor = boxBorder ? "border-[#FF772E]" : "border-none";
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium text-[16px] leading-[24px] text-[#404040]">
        {label}
      </label>
      <div className={`flex items-center ${className} relative`}>
        <input
          disabled={active}
          maxLength={maxlength}
          min={min ?? 0}
          name={name}
          max={max}
          value={value}
          step={step}
        //   type={
        //     type === "password" ? (viewPassword ? "text" : "password") : type
        //   }
          placeholder={placeholder}
          onChange={(event) => onChange(event, name)}
          className={`h-[48px] w-full rounded-[8px] border pl-3 pr-3 focus:outline-none
        bg-[#F4F4F4] ${borderColor} ${amount ? "pl-6" : "pl-3"}`}
          readOnly={readOnly}
        />
       {amount && <>
        <p className="flex items-center h-[48px] absolute left-3">$</p>
        <p className="flex items-center h-[48px] absolute right-3">USD</p>
        </>}
      </div>
    </div>
  );
};

export default InputField;