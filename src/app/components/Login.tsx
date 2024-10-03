"use client";
import React, { useState } from "react";
import Image from "next/image";
import InputField from "./ui/CustomInputFild";
import CustomButton from "./ui/CustomButton";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signInUser } from "../_actions/auth-action";
const Cookies = require("js-cookie");
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
  const [loading, setLoading] = useState(false)
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userInfo.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userInfo.email)) {
      newErrors.email = "Enter a valid email address";
    } else if (userInfo.email.length > 50) {
      newErrors.email = "Email must be 50 characters or less";
    }

    if (userInfo.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

   
    const signIn = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
        setLoading(true);
        const response = await signInUser(userInfo);
        if (response?.success) {
          // Cookies.set("access_token", response?.accessToken);
          // Cookies.set("userId",response?.user?._id)
          Cookies.set("user", JSON.stringify(response))
          toast(response?.message)
          router.push("/");
        } else {
          toast.info(response?.message ?? "Username or password incorrect.")
        }
        setLoading(false);
      };
    }
  const handleSignUp = () => {
    router.push("/signup");
  };
  return (
    <>
      <div className="flex flex-col h-[100%] md:flex-row w-full max-w-[1440px] m-auto lg:p-10 lg:gap-10">
        <div className="w-full hidden h-full lg:flex lg:w-[50%]">
          <Image
            src="/images/landing-bg.png"
            width={700}
            height={700}
            alt="Picture of the author"
            className="h-full w-full rounded-[80px]"
          />
        </div>
        <div className="flex flex-col w-full lg:w-[50%] justify-center items-center py-[50px] md:py-0 px-3 sm:px-0">
          <form
            className="flex flex-col w-full max-w-[400px]"
            onSubmit={signIn}
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
                <CustomButton label="Log In" className="w-full" type="submit" interactingAPI={loading}/>
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
