"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { GrLinkedinOption } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa";
import CustomButton from "./ui/CustomButton";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const navData = [
    {
      title: "Track My Tree",
      href: "/track",
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
  const [selected, setSelected] = useState<string | null>("Home");
  const pathName = usePathname()
  
  const handleLinkClick = (title: string) => {
    setSelected(title);
  };
  return (
    <nav
      className={`flex justify-between items-start w-full h-[230px] ${pathName === '/' ? 'bg-none text-white' : 'bg-[#F2F0EB] text-black'} shadow-lg px-3 sm:px-[30px] lg:px-[100px] py-[40px] lg:py-[50px] `}
      key="navbar"
    >
      <div className="flex lg:h-[48px] items-center w-full gap-1">
        <Link href="/">
        <p className="flex text-[12px] tracking-[4px] font-light text-nowrap">
        PLANT MILLION TREES
        </p>
        </Link>
      </div>

      <div className="w-full hidden lg:flex items-center gap-[14%]">
        <div className="flex gap-5 items-center justify-start">
          {navData.map((tab: any, index: any) => {
            return (
              <>
                <div key={index}>
                  <Link
                    href={`${tab.href}`}
                    className={`tracking-[1px] hidden lg:flex font-normal text-[16px] py-3 px-2 cursor-pointer uppercase text-nowrap`}
                    onClick={() => handleLinkClick(tab.title)}
                  >
                    {tab.title}
                  </Link>
                </div>
              </>
            );
          })}
        </div>
        <GrLinkedinOption
          size={35}
          className="p-1 cursor-pointer"
          onClick={() =>
            window.open("https://www.linkedin.com/groups/14208374/", "_blank")
          }
        />
        <CustomButton label={"DONATE"} className="w-[25%] h-[50px] font-semibold tracking-wide rounded-full"/>
      </div>
    </nav>
  );
}
