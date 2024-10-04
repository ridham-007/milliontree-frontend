"use client";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { PiCalendarDots } from "react-icons/pi";
import parse from 'html-react-parser';
interface BlogPreviewProps {
  data?: any;
}
export default function BlogPreview({ data }: BlogPreviewProps) {
  const formatDate = (dateString: string) => {
    const [datePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = months[parseInt(month) - 1];
    return `${monthName} ${parseInt(day)}, ${year}`;
  }
  return (
    <div className="flex flex-col w-full max-w-[1280px] gap-10 lg:gap-[70px] pb-10">
      <div className="w-full relative z-30">
        <Image
          src={data?.featureImage ? `${data?.featureImage}` : 'https://theconnecty.com/images/dummy.jpg'}
          width={350}
          height={350}
          alt=""
          unoptimized
          className="w-full h-[310px] rounded-[20px] lg:rounded-[40px] "
        />
        <p className="w-full top-32 text-[34px] sm:text-[44px] font-bold absolute text-white text-center tracking-[12px]">BLOG</p>
        {data?.creditBy ? <p className="text-[11px] text-black text-center">Image credit:<span className="text-black pl-2">{data?.creditBy}</span></p> : ""}
      </div>
      <div className="flex flex-col w-full sm:px-10 lg:px-20">
        <p className="text-[24px] md:text-[34px] font-bold leading-7 md:leading-10 pb-6">
          {data?.title}
        </p>
        <div className="flex w-full gap-7 pb-5">
          <div className="flex gap-2 items-center">
            <IoLocationOutline size={24} color="#666666" />
            <p className="text-[16px] text-[#666666] whitespace-nowrap w-[110px] md:w-[150px] lg:w-[140px] overflow-hidden truncate">
              {data?.location}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <PiCalendarDots size={20} color="#666666" />
            <p className="text-[16px] text-[#666666]">{data?.createDate ? formatDate(data?.createDate) : ""}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-9">
          <Image
            src={data?.featureImage ? `${data?.featureImage}` : 'https://theconnecty.com/images/dummy.jpg'}
            width={500}
            height={400}
            alt=""
            unoptimized
            className="w-full md:w-[380px] lg:w-[500px] h-[286px] lg:h-[400px] rounded-[20px] lg:rounded-[30px]"
          />
          <div className="w-full text-[14px] md:text-[18px] leading-7 article-container">{data?.description}</div>
        </div>
        <div className="w-full text-[14px] md:text-[18px] leading-7 font-medium article-container">{parse(data?.content || '')}</div>
      </div>
    </div>
  );
}
