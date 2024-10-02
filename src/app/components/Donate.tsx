"use client";
import React from "react";
import Image from "next/image";
import CustomButton from "./ui/CustomButton";

const Donate = () => {
  return (
    <>
      <div className="flex flex-col items-center w-full px-2 pb-[50px] sm:pb-[100px]">
        <div className="flex flex-col w-full max-w-[1280px] gap-[61px] ">
          <div className="w-full relative z-30">
            <Image
              src={"/images/donate-bg.png"}
              width={350}
              height={350}
              alt=""
              unoptimized
              className="w-full h-[280px] sm:h-[350px] rounded-[40px]"
            />
            <p className="w-full top-32 text-[34px] sm:text-[44px] font-bold absolute text-white text-center tracking-[12px]">
              DONATE
            </p>
          </div>
          <div className="flex flex-col w-full justify-center items-center gap-[28px] sm:gap-[68px]">
            <div className="font-bold text-[24px] sm:text-[34px] leading-[41px]">
              Donate to grow
            </div>
            <div className="flex flex-col sm:flex-row w-full justify-around items-center]">
              <div className="flex justify-center items-center">
                <CustomButton
                  label={"DONATE NOW"}
                  className="w-[350px] font-semibold py-[12px] px-[21px] !rounded-[24px] flex justify-center"
                  onClick={() =>
                    window.open(
                      "https://buy.stripe.com/6oE8zr590dzEgGQ4gu",
                      "_blank"
                    )
                  }
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="sm:border-t border-[#cccccc] transform rotate-90 mb-5  "></div>
                <div className="flex font-normal text-[18px] leading-[21px] justify-center items-center">
                  OR
                </div>
                <div className="sm:border-b border-[#cccccc] transform rotate-90 mt-5 "></div>
              </div>
              <div className="flex justify-center items-center">
                <Image
                  src={"/images/scanner.png"}
                  width={210}
                  height={200}
                  alt=""
                  unoptimized
                  className="w-[210px] h-[200px] rounded-[20px] lg:rounded-[40px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Donate;
