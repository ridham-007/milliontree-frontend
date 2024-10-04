import Image from "next/image";
import React, { useRef } from "react";
import { CiCalendar, CiLocationOn } from "react-icons/ci";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

interface SliderProps {
  sliderImages: any;
}

const ImageSlider: React.FC<SliderProps> = ({ sliderImages }) => {
  const sliderRef = useRef<Slider | null>(null);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: 4,
    arrows: false,
    responsive: [
      {
        breakpoint: 1640,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleBeforeChange = (oldIndex: any, newIndex: any) => {
    console.log({ oldIndex, newIndex });
  };

  return (
    <>
      <Slider ref={sliderRef} {...settings} beforeChange={handleBeforeChange}>
        {sliderImages.map((image: any, index: any) => (
          <div
            key={index}
            className="text-white !flex !flex-col !justify-center !items-center p-2"
          >
            <Image
              src={image.src}
              height={320}
              width={380}
              alt={image.alt}
              className="w-[380px] h-[320px] cursor-pointer rounded-[30px]"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/plantation-1.jpg";
              }}
            />
            <div className="flex flex-col items-start w-full max-w-[380px] mt-[26px] gap-2 px-2">
              <p className="font-bold text-[20px] h-[32px] text-black">
                {image.name}
              </p>
              <div className="flex justify-between w-full">
                <div className="flex gap-2 justify-center items-center text-[#666666]">
                  <CiLocationOn size={20} />
                  <p className="font-normal leading-[19.4px]">
                    {image.location}
                  </p>
                </div>
                <div className="flex gap-2 justify-center items-center text-[#666666]">
                  <CiCalendar size={20} />
                  <p className="font-normal leading-[19.4px]">{image.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div className="flex sm:flex-row flex-col-reverse w-full items-center justify-center gap-5 mt-[45px]">
        <p className="text-[#3BAD49] text-[18px] font-normal">
          1/{Math.ceil(sliderImages.length / 4)}
        </p>
        <div className="flex text-[#666666] gap-[48px] sm:gap-3">
          <FaArrowLeftLong
            size={28}
            className="cursor-pointer w-8"
            onClick={() => sliderRef.current?.slickPrev()}
          />
          <FaArrowRightLong
            size={28}
            className="cursor-pointer w-8"
            onClick={() => sliderRef.current?.slickNext()}
          />
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
