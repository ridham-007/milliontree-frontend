"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { PiCalendarDots } from "react-icons/pi";
interface CardProps {
    data?: any;
    className?:any;
}
const Card = ({
 data,
 className
}: CardProps) => {
const path = usePathname();  
  return (
    <>
 {data?.map((cur:any,index:number)=>{ 
    return( 
    <div className={`flex flex-col w-full ${className} gap-8`} key={index}>
        <Image src={`${cur?.image}`} width={310} height={310} alt="" unoptimized className="w-full h-[280px] sm:h-[310px] rounded-[20px] lg:rounded-[40px]"/>
        <div className="flex flex-col w-full gap-3">
        <p className="w full text-[20px] font-bold whitespace-nowrap overflow-hidden truncate">{cur?.title}</p>
        <div className="flex justify-between w-full">
         <div className="flex gap-2 items-center">
         <IoLocationOutline size={24} color="#666666"/>
         <p className="text-[16px] text-[#666666] whitespace-nowrap w-[110px] md:w-[150px] lg:w-[140px] overflow-hidden truncate">{cur?.location}</p>
         </div>
         <div className="flex gap-2 items-center">
         <PiCalendarDots size={20} color="#666666"/>
         <p className="text-[16px] text-[#666666]">{cur?.date}</p>
         </div>
        </div>
        <p className="w-full text-[16px] text-ellipsis line-clamp-2">{cur?.description}</p>
        </div>
    </div>)})}
  </>
  );
};

export default Card;
