"use client";
import React, { useState } from "react";
import Image from "next/image";
import InputField from "./ui/CustomInputFild";
import CustomButton from "./ui/CustomButton";
import { useRouter } from "next/navigation";

interface LoginUser {
  email: string;
  password: string;
}

const loginInitialValues: LoginUser = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [userInfo, setUserInfo] = useState<LoginUser>(loginInitialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (userInfo.email.length == 0) {
      newErrors.email = "Email is Required";
    }

    if (userInfo.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
    }
  };
  const handleSignUp = () => {
    router.push("/signup");
  };
  return (
    <>
      <div className="flex flex-col md:flex-row w-full max-w-[1440px] m-auto">
        <div className="w-full hidden md:flex">
          <Image
            src="/images/landing-bg.png"
            width={700}
            height={700}
            alt="Picture of the author"
            className="h-[700px] w-[700px]"
          />
        </div>
        <div className="flex flex-col w-full justify-center items-center py-[50px] md:py-0 px-3 sm:px-0">
          <form
            className="flex flex-col w-full max-w-[400px]"
            onSubmit={handleSubmit}
          >
            <div className="flex text-[28px] mb-8 font-bold leading-9 justify-center">
              Hello again!
            </div>
            <div className="flex flex-col w-full gap-4">
              <div className="flex flex-col relative gap-2">
                <label className="font-medium leading-[24px] font-Montserrat">
                  Email
                </label>
                <InputField
                  name="email"
                  placeholder="Enter your email"
                  type="text"
                  onChange={handleChange}
                  value={userInfo.email}
                  bgColor="#FFF"
                  className="font-normal leading-[24px] border rounded-md"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>
              <div className="flex flex-col relative gap-2">
                <label className="font-medium leading-[24px] font-Montserrat">
                  Password
                </label>
                <InputField
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  showPasswordSuffix
                  onChange={handleChange}
                  value={userInfo.password}
                  bgColor="#FFF"
                  className="font-normal leading-[24px] border rounded-md"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <div className="text-[#2979FF] font-medium leading-6 cursor-pointer">
                  Forgot password
                </div>
              </div>
              <div className="mt-2">
                <CustomButton label="Log In" className="w-full" type="submit" />
              </div>

              <div className="w-full flex gap-[32px] items-center">
                <div className=" w-full border border-[#D4D7DD]"></div>
                <div className="text-[#727885] font-medium">Or</div>
                <div className=" w-full border border-[#D4D7DD]"></div>
              </div>
            </div>
            <p className="flex text-[#727885] text-[16px] justify-center font-normal text-center gap-1 mt-3">
              Join the Milliontree?
              <span
                className="text-[#2979FF] font-medium text-[16px] cursor-pointer"
                onClick={handleSignUp}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
