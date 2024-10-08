"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { GoArrowLeft } from "react-icons/go";
import {
  forgotPassword,
  resendOtpCode,
  resetCode,
  resetPassword,
} from "@/app/_actions/auth-action";
import InputField from "./ui/CustomInputFild";
import CustomButton from "./ui/CustomButton";

interface LoginUser {
  email: string;
  password: string;
}

interface PasswordProps {
  email: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface LogInFormProps {
  redirectUri?: string;
}

const loginInitialValues: LoginUser = {
  email: "",
  password: "",
};

const ForgotPassword = (props: LogInFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState<LoginUser>({
    ...loginInitialValues,
    email: searchParams.get("email") || "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(true);
  const [otpStep, setOtpStep] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(300);
  const getOtpString = (): string => otpValues.join("");
  const [newPasswordStep, setNewPasswordStep] = useState(false);
  const [userError, setUserError] = useState<any>('')
  const initialPasswordData = {
    email: "",
    newPassword: "",
    confirmPassword: "",
  };
  const [passwordData, setPasswordData] =
    useState<PasswordProps>(initialPasswordData);
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordProps>>({});

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    const trimmedValue = value.trim();
    setUserError('')
    const updatedUserInfo = { ...userInfo, [name]: trimmedValue };
    setUserInfo(updatedUserInfo);
  };

  const handleOtpChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;

    setOtpValues(newOtpValues);

    const inputs = Array.from(
      document.querySelectorAll(".otp-input")
    ) as HTMLInputElement[];
    focusNextInput(event, index, inputs);
  };

  const handleForgotPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userInfo.email) {
      setUserError("Email is required.");
      return;
    }
    if (!emailRegex.test(userInfo.email)) {
        setUserError("Please enter a valid email address.");
        return;
      }
    setSubmitLoading(true);
    try {
      const response = await forgotPassword(userInfo.email);
      if (response?.success) {
        setForgetPassword(false);
        setOtpStep(true);
      } else {
        setUserError(response?.message)
      }
    } catch (error) {
      console.error("Error during password reset", error);
      toast.error("An error occurred. Please try again.");
    }

    setSubmitLoading(false);
  };

  const handleResendOtp = async () => {
    const otpCode = getOtpString();
    setSubmitLoading(true);
    try {
      const response = await resendOtpCode(userInfo.email, otpCode);

      if (response?.success) {
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error during Resend otp:", error);
      toast.error("An error occurred. Please try again.");
    }
    setSubmitLoading(false);
  };

  const handleOtpSubmit = async () => {
    const otpCode = getOtpString();

    if (otpCode.length !== 4) {
      toast.error("Please enter the complete OTP.");
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await resetCode(userInfo.email, otpCode);
      if (response?.success) {
        setForgetPassword(false);
        setOtpStep(false);
        setNewPasswordStep(true);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error during submitted otp:", error);
      toast.error("An error occurred. Please try again.");
    }

    setSubmitLoading(false);
  };

  const handlePassword = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const value = event.target.value;
    const trimmedValue = value.trim();
    const updatedData = { ...passwordData, [fieldName]: trimmedValue };
    setPasswordData(updatedData);
    setPasswordErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
  };

  const handleNewPasswordSubmit = async () => {
    const { newPassword, confirmPassword } = passwordData;
    const errors: Partial<PasswordProps> = {};
    if (!newPassword || newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters.";
    }
    if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    setSubmitLoading(true);
    try {
      const response = await resetPassword(
        userInfo.email,
        passwordData.newPassword ?? ''
      );

      if (response?.success) {
        setPasswordData(initialPasswordData);
        setNewPasswordStep(false);
        setForgetPassword(false);
        setOtpStep(false);
        setUserInfo(loginInitialValues);
        toast.success(response?.message);
        router.push("/login");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
    }
    setSubmitLoading(false);
  };

  const focusNextInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    inputs: HTMLInputElement[]
  ) => {
    if (event.target.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    } else if (event.target.value.length === 0 && index > 0) {
      inputs[index - 1].focus();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
      }`;
  };

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const renderForgotPasswordForm = () => (
    <div className="flex flex-col w-full justify-center items-center gap-6">
      <form
        className="flex flex-col w-full max-w-[400px] gap-8 justify-center items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleForgotPassword();
        }}
      >
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="text-[28px] font-bold leading-9">
            Forgot password?
          </div>
          <div className="text-[#727885] font-normal text-center">
            No worries, we&apos;ll send you reset instruction. Enter your email
            address below.
          </div>
        </div>
        <div className="flex flex-col w-full relative gap-2">
          <label className="font-medium leading-[24px] font-Montserrat">
            Email
          </label>
          <InputField
            name="email"
            placeholder="Enter your email"
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleOnChange(e, "email")
            }
            value={userInfo.email}
            className="font-medium leading-[24px] border border-[#cccccc]"
          />
          {userError && <p className="text-red-500">{userError}</p>}
        </div>
        <CustomButton
          label="Reset password"
          className="w-full"
          type="submit"
          interactingAPI={submitLoading}
        />
        <div
          className="flex text-[#2979FF] font-semibold leading-6 cursor-pointer justify-center items-center gap-2"
          onClick={() => router.push("/login")}
        >
          <GoArrowLeft className="text-[20px]" />
          Back to log in
        </div>
      </form>
    </div>
  );

  const renderOtpForm = () => (
    <div className="flex flex-col w-full justify-center items-center gap-6">
      <form
        className="flex flex-col w-full max-w-[400px] gap-8 justify-center items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleOtpSubmit();
        }}
      >
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="text-[28px] font-bold leading-9">Password reset</div>
          <div className="text-[#727885] font-normal text-center">
            We already sent a code to
            <span className="font-semibold">
              {" "}
              {userInfo.email || "your email"}.{" "}
            </span>
            Please check your inbox and insert the code in form below.
          </div>
          <div className="flex flex-col items-center">
            <p className="text-[#727885] text-[16px] font-medium">
              {timer > 0 ? (
                `Resend ${formatTime(timer)}`
              ) : (
                <button
                  className={`text-[#2979FF] font-semibold text-[16px] ${timer > 0 ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-8 sm:gap-10">
          {otpValues.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(e, index)}
              className="w-12 h-12 text-center border-b-2 border-[#727885] font-medium leading-[24px] otp-input"
            />
          ))}
        </div>

        <CustomButton
          label="Reset Password"
          className="w-full mt-4"
          type="submit"
          interactingAPI={submitLoading}
        />

        <div
          className="flex text-[#2979FF] font-semibold leading-6 cursor-pointer justify-center items-center gap-2"
          onClick={() => {
            router.push("/login");
          }}
        >
          <GoArrowLeft className="text-[20px]" />
          Back to log in
        </div>
      </form>
    </div>
  );

  const renderNewPasswordForm = () => (
    <div className="flex flex-col w-full justify-center items-center gap-6">
      <form
        className="flex flex-col w-full max-w-[400px] gap-8 justify-center items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleNewPasswordSubmit();
        }}
      >
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="text-[28px] font-bold leading-9">
            Set New Password
          </div>
          <div className="text-[#727885] font-normal text-center">
            Please enter and confirm your new password.
          </div>
        </div>

        <div className="flex flex-col w-full gap-2 relative">
          <label className="text-[#565656] text-[16px] font-medium leading-6">
            New password
          </label>
          <InputField
            name="newPassword"
            placeholder="Enter your new password"
            type="password"
            showPasswordSuffix
            className="border border-[#cccccc]"
            value={passwordData.newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlePassword(e, "newPassword")
            }
          />
          {passwordErrors.newPassword && (
            <p className="text-red-500 text-sm">{passwordErrors.newPassword}</p>
          )}
        </div>
        <div className="flex flex-col w-full gap-2 relative">
          <label className="text-[#565656] text-[16px] font-medium leading-6">
            Confirm password
          </label>
          <InputField
            name="confirmPassword"
            placeholder="Confirm password"
            type="password"
            className="border border-[#cccccc]"
            showPasswordSuffix
            value={passwordData.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlePassword(e, "confirmPassword")
            }
          />
          {passwordErrors.confirmPassword && (
            <p className="text-red-500 text-sm">{passwordErrors.confirmPassword}</p>
          )}
        </div>
        <CustomButton
          label="Submit"
          className="w-full mt-4"
          type="submit"
          interactingAPI={submitLoading}
        />
      </form>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full px-2 pb-[50px] sm:pb-[100px]">
    <div className="flex flex-col w-full max-w-[1280px] gap-6 lg:gap-[70px]">
      <div className="w-full relative z-30">
        <Image src={'/images/landing-bg.png'} width={350} height={350} alt="" unoptimized className="w-full h-[240px] sm:h-[350px] rounded-[20px] lg:rounded-[40px]" />
        <p className="w-full top-[100px] sm:top-[150px] text-[34px] sm:text-[44px] font-bold absolute text-white text-center leading-[41px] tracking-[12px]">{ newPasswordStep ? 'New password' : 'Forgot password'}</p>
      </div>
      <div className="flex flex-col w-full justify-center items-center py-[50px] md:py-0 px-3 sm:px-0">
      {newPasswordStep
            ? renderNewPasswordForm()
            : otpStep
              ? renderOtpForm()
              : forgetPassword
                ? renderForgotPasswordForm()
                : null}
      </div>
    </div>
  </div>
  );
};

export default ForgotPassword;
