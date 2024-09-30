"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { GrLinkedinOption } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa";
import CustomButton from "./ui/CustomButton";

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

  const handleLinkClick = (title: string) => {
    setSelected(title);
  };
  return (
    <nav
      className="flex justify-between items-center w-full h-[100px] lg:h-[90px] shadow-lg px-3 sm:px-[30px] lg:px-[100px] lg:py-[50px] text-white"
      key="navbar"
    >
      <div className="flex flex-col w-full gap-1">
        <Link href="/" className="w-[20%] flex justify-center">
          <Image
            src="/images/palm-tree.png"
            height={70}
            width={250}
            alt="logo"
            className="w-[37px] h-[68px] cursor-pointer"
          />
        </Link>

        <p className="flex text-[12px] tracking-[4px] font-light text-nowrap">
        PLANT MILLION TREES
        </p>
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
