'use client'
import Image from "next/image"
import Card from "./Card"
import { useState } from "react";
import Pagination from "./ui/Pagination";
 
const BlogData =[
    {image:'/images/plantation-1.jpg', title:'Roots of RenewalRenewal RenewalRenewal Renewal', location:'Copenhagen, Denmarxcgfgdfdsgdg Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
    {image:'/images/plantation-1.jpg', title:'Roots of Renewal', location:'Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
    {image:'/images/plantation-1.jpg', title:'Roots of Renewal', location:'Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
    {image:'/images/plantation-1.jpg', title:'Roots of Renewal', location:'Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
    {image:'/images/plantation-1.jpg', title:'Roots of Renewal', location:'Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
    {image:'/images/plantation-1.jpg', title:'Roots of Renewal', location:'Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
    {image:'/images/plantation-1.jpg', title:'Roots of RenewalRenewal RenewalRenewal Renewal', location:'Copenhagen, Denmarxcgfgdfdsgdg Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
    {image:'/images/plantation-1.jpg', title:'Roots of Renewal', location:'Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
    {image:'/images/plantation-1.jpg', title:'Roots of Renewal', location:'Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
    {image:'/images/plantation-1.jpg', title:'Roots of Renewal', location:'Copenhagen, Denmark', date:'02.01.2024', description:'n an era marked by growing environmental concerns, tree-planting events have emerged an era marked by growing environmental concerns, tree-planting events have emerged'},
 ]
export default function Blog() {
    const initialValue = {
        page: 1,
        limit: 4,
      };
const [blogsData, setBlogsData] = useState<any>(initialValue);
    
  const handlePageChange = (page: number) => {
    setBlogsData({ ...blogsData, page: page });
  };
    return(
        <div className="flex flex-col items-center w-full px-2">
        <div className="flex flex-col w-full max-w-[1280px] gap-10 lg:gap-[70px]">
            <div className="w-full relative z-30">
        <Image src={'/images/plantation-3.jpg'} width={350} height={350} alt="" unoptimized className="w-full h-[280px] sm:h-[350px] rounded-[20px] lg:rounded-[40px]"/>
        <p className="w-full top-32 text-[34px] sm:text-[44px] font-bold absolute text-white text-center tracking-[12px]">BLOG</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full justify-items-center sm:px-5">
          <Card 
          data={BlogData}
          className={'max-w-[380px] rounded-[10px] lg:rounded-[30px]'}
          />
        </div>
        <div className="flex justify-center pb-10 lg:pb-20"> 
         {BlogData && <Pagination
            totalPages={6}
            onPageChange={handlePageChange}
            currentPage={1}
          />}
         </div>
        </div>
        </div>
    )
}