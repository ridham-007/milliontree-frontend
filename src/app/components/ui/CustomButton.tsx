"use client";
import React from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  label: string | undefined | React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  callback?: (e?: any) => void | Promise<void> | undefined | any;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  style?: boolean;
  interactingAPI?: boolean;
  name?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const CustomButton = ({
  label = "",
  type = "button",
  callback,
  className,
  prefixIcon,
  suffixIcon,
  style,
  interactingAPI = false,
  name,
  disabled = false,
  onClick,
}: ButtonProps) => {
  const { pending: formPending } = useFormStatus();

  const handleButtonClick = async (e: any) => {
    e?.stopPropagation();

    if (typeof onClick === "function") {
      onClick();
    }

    if (typeof callback === "function") {
      await callback(e);
    }
  };

  const buttonLabel = () => {
    return (
      <>
        {prefixIcon}
        {label}
        {suffixIcon}
      </>
    );
  };

  const buttonLoader = () => {
    return (
      <svg className="h-5 w-5 animate-spin " viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  };

  const getButton = () => {
    let showLoader = formPending && type == "submit";
    showLoader ||= interactingAPI;
    return showLoader ? buttonLoader() : buttonLabel();
  };

  return (
    <button
      disabled={formPending || disabled}
      type={type}
      name={name}
      className={`flex cursor-pointer items-center justify-center gap-1 rounded-[8px] ${
        style ? "px-0 py-0" : "px-4 py-2"
      } font-normal bg-[#F1B932] text-black ${
        disabled && "cursor-not-allowed bg-[#cfc7c2]"
      } ${className}`}
      onClick={handleButtonClick}
    >
      {getButton()}
    </button>
  );
};

export default CustomButton;
