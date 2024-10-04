"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GrLinkedinOption } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa";
import CustomButton from "./ui/CustomButton";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { Avatar, CircularProgress } from "@mui/material";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
const Cookies = require("js-cookie");
interface navbarProps {
  userData?: any;
}
export default function Navbar(props: navbarProps) {
  const userInfo: any = props?.userData;
  const userName = `${userInfo?.fName} ${userInfo?.lName}`;

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
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const openPopup = Boolean(anchor);
  const id = open ? "simple-popup" : undefined;
  const popupRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const handleLinkClick = (title: string) => {
    setSelected(title);
  };

  const handleOnClick = (value: string) => {
    setLoading(true);
    if (value === "logIn") {
      setAnchor(null);
      router.push("/login");
    } else {
      setAnchor(null);
      Cookies.set("user", null);
      router.push("/login");
    }
  };

  const handleDonate = () => {
    router.push("/donate");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setAnchor(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`flex items-start w-full ${pathName === "/admin" ? "h-[90px] py-[10px] lg:py-[20px]" : "h-[230px] py-[40px] lg:py-[50px]"}
       ${pathName === "/" ? "bg-none text-white" : "bg-[#F2F0EB] text-black"
        } shadow-lg px-3 sm:px-[30px] xl:px-[70px] py-[40px] lg:py-[50px] `}
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
          {/* <div className="lg:hidden flex items-center">
            <button onClick={toggleMenu}>
              {isMenuOpen ? (
                <IoClose className="text-[20px] sm:text-[24px]" />
              ) : (
                <FiMenu className="text-[20px] sm:text-[24px]" />
              )}
            </button>
          </div> */}
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
        <div className="flex w-full items-center gap-5 justify-end">
          <GrLinkedinOption
            className="p-1 cursor-pointer size-[35px]"
            onClick={() =>
              window.open("https://www.linkedin.com/company/plantmilliontrees/", "_blank")
            }
          />


          <CustomButton
            label={"DONATE"}
            className=" h-[50px] font-semibold tracking-wide rounded-full w-full !max-w-[210px]"
            onClick={handleDonate}
          />
          {userInfo
            ? !(pathName === "/login" || pathName === "/signup") && (
              <button type="button" onClick={handleClick} className="w-10">
                <Avatar
                  sx={{
                    color: pathName === '/' ? '#3A8340' : '#f2f2f2',
                    background: pathName === '/' ? '#f2f2f2' : '#3A8340',
                    width: "40px",
                  }}
                >
                  {userInfo?.fName?.charAt(0) || "A"}
                  {userInfo?.lName?.charAt(0) || "N"}
                </Avatar>
              </button>
            )
            : !(pathName === "/login") && (
              <Link
                href="/login"
                className="text-white !w-[70px] bg-[#3A8340] py-2 px-3 font-semibold rounded-lg"
              >
                Log In
              </Link>
            )}
          <BasePopup
            id={id}
            open={openPopup}
            anchor={anchor}
            ref={popupRef}
            className={`relative flex flex-col w-[280px] sm:w-[300px] shadow-md ${pathName === "/" ? "bg-transparent" : "bg-white"} rounded-md py-3 px-5 gap-4 border border-[#f2f2f24b] z-40 backdrop-blur-[2px]`}
          >
            <div className="absolute inset-0 bg-transparent backdrop-blur-sm"></div>
            <div className="relative z-10">
              {userInfo && (
                <div className="flex gap-3">
                  {userInfo && (
                    <>
                      <Avatar
                        sx={{
                          color: "#3A8340",
                          background: "#f2f2f2",
                        }}
                        className="avatar-container cursor-pointer"
                      >
                        {userInfo?.fName?.charAt(0) || "A"}
                        {userInfo?.lName?.charAt(0) || "N"}
                      </Avatar>
                    </>
                  )}
                  <div className="w-[205px]">
                    <p className={`whitespace-nowrap w-full overflow-hidden ${pathName === "/" ? "text-[#cacace]" : "text-[#a5a5a9]"} truncate`}>
                      {userName === undefined ? "User Name" : userName}
                    </p>
                    <p className={`text-[12px] w-full break-words  ${pathName === "/" ? "text-[#cacace]" : "text-[#a5a5a9]"} text-ellipsis line-clamp-1`}>
                      {userInfo?.email}
                    </p>
                  </div>
                </div>
              )}
              <hr className={`h-[2px] border-0 ${pathName === "/" ? "bg-[#f2f2f24b]" : "bg-[#d7d7dd46]"} my-2`} />
              <div className="flex w-full justify-between flex-col">
                <button
                  className="flex w-24 h-10 text-[#f1c40f] font-medium text-[16px] justify-center items-center gap-4 cursor-pointer border border-[#f1c40f] rounded-md hover:shadow-md relative self-center"
                  type="submit"
                  onClick={() => {
                    handleOnClick(userInfo ? "logOut" : "logIn");
                  }}
                >
                  {userInfo ? "Log Out" : "Log In"}
                  {loading && (
                    <div className="flex justify-center items-center w-full h-full absolute bg-white opacity-80 rounded-[12px]">
                      <CircularProgress size={30} className="text-[#3A8340]" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </BasePopup>
        </div>
      </div>

      {/* mobile view */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-0 right-0 w-full bg-[#3BAD49] text-[#fff] shadow-lg flex flex-col mb-[500px] pt-[40px] pb-[320px]">
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
