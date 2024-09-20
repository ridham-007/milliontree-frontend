"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { GrLinkedinOption } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa";

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
  return (
    <nav
      className="flex flex-col w-full h-[100px] lg:h-[138px] shadow-lg justify-center px-3 sm:px-[30px] lg:px-[100px] lg:py-[50px]"
      key="navbar"
    >
      <div className="flex flex-col w-full px-3">
        <div className="flex justify-between">
          <Image
            src="/images/logo.png"
            height={50}
            width={250}
            alt="logo"
            className="w-[170px] h-9"
          />
          <div className="flex flex-col">
            <div className="flex gap-2 ml-6">
              <Image
                src="/images/calendar.png"
                alt="cal"
                width={25}
                height={25}
                className="w-[30px] h-[35px]"
              />
              <div className="flex flex-col text-[#898a8b]">
                <p>Mar 18-20 </p>
                <p>Stanford GSB</p>
              </div>
            </div>
            <p className="text-[#898a8b]">600+ in person attendees</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex gap-5 justify-start">
            {navData.map((tab: any, index: any) => {
              return (
                <>
                  <div key={index}>
                    <Link
                      href={`${tab.href}`}
                      className={`hidden lg:flex text-[18px] font-bold py-3 px-2 cursor-pointer transition-all duration-300 ease-in-out ${
                        selected === tab.title
                          ? "text-[#306E1D] font-semibold border-b-2 border-[#306E1D]"
                          : "hover:text-[#306E1D] border-b-2 border-transparent"
                      }`}
                      onClick={() => handleLinkClick(tab.title)}
                    >
                      {tab.title}
                    </Link>
                  </div>
                </>
              );
            })}
          </div>
          <div className="flex gap-4">
            <GrLinkedinOption
              size={30}
              color="black"
              className="p-1 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/groups/14208374/",
                  "_blank"
                )
              }
            />
            <FaYoutube
              size={30}
              color="black"
              className="p-1 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/@stanfordleadme2we",
                  "_blank"
                )
              }
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
