"use client";

import Link from "next/link";
import { useState } from "react";
import { GrLinkedinOption } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa";
import CustomButton from "./ui/CustomButton";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

export default function Navbar() {
  const navData = [
    {
      title: "Track My Tree",
      href: "/track-my-tree",
      key: "track-my-tree",
    },
    {
      title: "Event",
      href: "/event",
      key: "event",
    },
    {
      title: "Blog",
      href: "/blog",
      key: "blog",
    },
  ];
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathName = usePathname();

  const handleLinkClick = (title: string) => {
    setSelected(title);
  };

  const handleDonate = () => {
    router.push("/donate");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`flex justify-between items-start w-full h-[230px] ${
        pathName === "/" ? "bg-none text-white" : "bg-[#F2F0EB] text-black"
      } shadow-lg px-3 sm:px-[30px] xl:px-[100px] py-[40px] lg:py-[50px] `}
      key="navbar"
    >
      {/* mobile view menu is closed */}
      {!isMenuOpen && (
        <div className="flex w-full">
          <div className="flex lg:h-[48px] items-center w-full">
            <Link href="/">
              <p className="flex text-[12px] sm:text-[14px] tracking-[4px] font-light text-nowrap ">
                PLANT MILLION TREES
              </p>
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center">
            <button onClick={toggleMenu}>
              {isMenuOpen ? (
                <IoClose className="text-[20px] sm:text-[24px]" />
              ) : (
                <FiMenu className="text-[20px] sm:text-[24px]" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* desktop view */}
      <div className="w-full hidden lg:flex items-center justify-between gap-5">
        <div className="flex gap-3 lg:gap-5 items-center justify-start mt-[7px]">
          {navData.map((tab, index) => (
            <div key={index}>
              <Link
                href={`${tab.href}`}
                className={`tracking-[1px] hidden lg:flex font-normal text-[16px] cursor-pointer uppercase text-nowrap`}
                onClick={() => handleLinkClick(tab.title)}
              >
                {tab.title}
              </Link>
            </div>
          ))}
        </div>
        <GrLinkedinOption
          size={35}
          className="p-1 cursor-pointer"
          onClick={() =>
            window.open("https://www.linkedin.com/groups/14208374/", "_blank")
          }
        />
        <CustomButton
          label={"DONATE"}
          className=" h-[50px] font-semibold tracking-wide rounded-full w-[40%]"
          onClick={handleDonate}
        />
      </div>

      {/* mobile view */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-0 right-0 w-full bg-[#3BAD49] text-[#fff] shadow-lg flex flex-col mb-[500px] pt-[40px] pb-[320px] !z-40">
          <div className="flex !pt-0 p-[10px]">
            <div className="flex lg:h-[48px] items-center w-full gap-1">
              <Link href="/">
                <p className="flex text-[12px] sm:text-[14px] tracking-[4px] font-light text-nowrap">
                  PLANT MILLION TREES
                </p>
              </Link>
            </div>

            <div className="lg:hidden flex items-center">
              <button onClick={toggleMenu}>
                {isMenuOpen ? (
                  <IoClose className="text-[20px] sm:text-[24px]" />
                ) : (
                  <FiMenu className="text-[20px] sm:text-[24px]" />
                )}
              </button>
            </div>
          </div>
          {/* Menu content */}
          <div className="flex flex-col px-[83px] gap-[32px] mt-[100px]">
            {navData.map((tab, index) => (
              <div key={index}>
                <Link
                  href={tab.href}
                  className={`tracking-[1px] font-semibold text-[14px] sm:text-[16px] leading-[17px] py-3 px-2 cursor-pointer uppercase`}
                  onClick={() => handleLinkClick(tab.title)}
                >
                  {tab.title}
                </Link>
              </div>
            ))}
            <GrLinkedinOption
              size={35}
              className="p-1 cursor-pointer mt-[40px]"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/groups/14208374/",
                  "_blank"
                )
              }
            />
          </div>

          <div className="flex gap-2 justify-center items-center">
            <CustomButton
              label={"DONATE"}
              className="h-[50px] w-[210px] font-semibold tracking-wide rounded-full self-center mt-[80px] "
              onClick={handleDonate}
            />
          </div>
        </div>
      )}
    </nav>
  );
}
