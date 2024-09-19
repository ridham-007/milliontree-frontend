"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
    const navData = [
        {
          title: "Home",
          href: "/",
          key: "home",
        },
        {
          title: "Schedule",
          href: "/schedule",
          key: "schedule",
        },
        {
          title: "Speakers",
          href: "/speakers",
          key: "speakers",
        },
        {
          title: "About Us",
          href: "/about-us",
          key: "about",
        },
        {
          title: "Committee",
          href: "/committee",
          key: "committee",
        },
        {
          title: "Location",
          href: "/location",
          key: "location",
          },
      ];
  const [selected, setSelected] = useState<string | null>("Home");
     
      const handleLinkClick = (title: string) => {
        setSelected(title);
      };
    return(
        <nav
        className="flex flex-col w-full h-[100px] lg:h-[128px] shadow-lg justify-center px-3 sm:px-[30px] lg:px-[100px]"
        key="navbar"
      >
        <div className="flex flex-col lg:gap-2 w-full px-3">
         <Image src="/images/logo.png" height={50} width={250} alt="logo" className="w-[170px] h-9"/>
          <div className="hidden lg:flex items-center gap-5">
            {navData.map((tab: any, index: any) => {
             
              return (
                <div key={index}>
                  <Link
                    href={`${tab.href}`}
                    className={`hidden lg:flex text-[14px] py-3 px-2 cursor-pointer transition-all duration-300 ease-in-out ${selected === tab.title
                      ? "text-[#306E1D] font-semibold border-b-2 border-[#306E1D]"
                      : "hover:text-[#306E1D] border-b-2 border-transparent"
                      }`}
                    onClick={() => handleLinkClick(tab.title)}
                  >
                    {tab.title}
                  </Link>
                </div>
              )
            })}
          </div>
          </div>
          </nav>
    )
}