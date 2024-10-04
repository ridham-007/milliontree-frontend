"use client";
import React, { useState } from "react";
import Image from "next/image";
import InputField from "./ui/CustomInputFild";
import CustomButton from "./ui/CustomButton";
import { useRouter } from "next/navigation";
import { signUpUser } from "../_actions/auth-action";
import { toast } from "react-toastify";
const Cookies = require("js-cookie");
interface LoginUser {
  fName: string;
  lName: string;
  email: string;
  password: string;
}

const loginInitialValues: LoginUser = {
  fName: "",
  lName: "",
  email: "",
  password: "",
};

const SignUpForm = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<LoginUser>(loginInitialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false)

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

    if (userInfo.fName.trim() === "") {
      newErrors.fName = "First name is required";
    } else if (userInfo.fName.length > 35) {
      newErrors.fName = "First name must be 35 characters or less";
    }

    if (userInfo.lName.trim() === "") {
      newErrors.lName = "Last name is required";
    } else if (userInfo.lName.length > 35) {
      newErrors.lName = "Last name must be 35 characters or less";
    }

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

    if (!isTermsAccepted) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    if (userInfo.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signUp = async (e: any) => {
    e.preventDefault();

    const isError = validateForm();
    if (isError) {
      setLoading(true);
      const response = await signUpUser(userInfo);
      if (response?.success) {
        const data = {
          fName: response?.user?.fName,
          lName: response?.user?.lName,
          userId: response?.user?._id,
          userRole: response?.user?.userRole,
          accessToken: response.accessToken,
        }
        Cookies.set("user", JSON.stringify(data))
        toast(response?.message);
        router.push("/");
      } else {
        toast.error(response?.message);
      }
      setLoading(false);
    }
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsTermsAccepted(checked);
    if (checked) {
      setErrors({ ...errors, terms: '' });
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };
  return (
    <>
      <div className="flex flex-col items-center w-full px-2 pb-[50px] sm:pb-[100px]">
        <div className="flex flex-col w-full max-w-[1280px] gap-6 lg:gap-[70px]">
          <div className="w-full relative z-30">
            <Image src={'/images/landing-bg.png'} width={350} height={350} alt="" unoptimized className="w-full h-[240px] sm:h-[350px] rounded-[20px] lg:rounded-[40px]" />
            <p className="w-full top-[100px] sm:top-[150px] text-[34px] sm:text-[44px] font-bold absolute text-white text-center leading-[41px] tracking-[12px]">SignUp</p>
          </div>
          <div className="flex flex-col w-full justify-center items-center py-[50px] md:py-0 px-3 sm:px-0">
            <form
              className="flex flex-col w-full max-w-[400px]"
              onSubmit={signUp}
            >
              <div className="flex text-[28px] mb-8 font-bold leading-9 justify-center">
                Create Account
              </div>
              <div className="flex flex-col w-full gap-4">
                <div className="flex flex-col relative gap-2">
                  <label className="font-medium leading-[24px] font-Montserrat">
                    First Name
                  </label>
                  <InputField
                    name="fName"
                    placeholder="Enter first name"
                    type="text"
                    onChange={handleChange}
                    value={userInfo.fName}
                    bgColor="#FFF"
                    className="font-normal leading-[24px] border rounded-md"
                  />
                  {errors.fName && (
                    <span className="text-red-500 text-sm">{errors.fName}</span>
                  )}
                </div>
                <div className="flex flex-col relative gap-2">
                  <label className="font-medium leading-[24px] font-Montserrat">
                    Last Name
                  </label>
                  <InputField
                    name="lName"
                    placeholder="Enter your last name"
                    type="text"
                    onChange={handleChange}
                    value={userInfo.lName}
                    bgColor="#FFF"
                    className="font-normal leading-[24px] border rounded-md"
                  />
                  {errors.lName && (
                    <span className="text-red-500 text-sm">{errors.lName}</span>
                  )}
                </div>
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
                <div className="relative">
                  <div className="flex gap-3 text-[17px] text-[#727885] font-normal">
                    <input
                      type="checkbox"
                      checked={isTermsAccepted}
                      onChange={handleCheckboxChange}
                    />

                    <p>Accept terms and conditions</p>
                  </div>
                  {errors?.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
                </div>
                <div className="mt-2">
                  <CustomButton
                    label="Sign Up"
                    className="w-full"
                    type="submit"
                    interactingAPI={loading}
                  />
                </div>
                <div className="w-full flex gap-[32px] items-center">
                  <div className=" w-full border border-[#D4D7DD]"></div>
                  <div className="text-[#727885] font-medium">Or</div>
                  <div className=" w-full border border-[#D4D7DD]"></div>
                </div>
              </div>

              <p className="flex justify-center items-center text-[#727885] text-[16px] font-normal text-center gap-1 mt-3">
                Already have an account?
                <span
                  className="text-[#2979FF] font-medium text-[16px] cursor-pointer"
                  onClick={handleLogin}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
