"use client";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { PiCalendarDots } from "react-icons/pi";

export default function BlogPreview() {
  return (
      <div className="flex flex-col w-full max-w-[1280px] gap-10 lg:gap-[70px]">
        <Image
          src={"/images/plantation-3.jpg"}
          width={350}
          height={350}
          alt=""
          unoptimized
          className="w-full h-[310px] rounded-[20px] lg:rounded-[40px] z-10"
        />
        <div className="flex flex-col w-full sm:px-10 lg:px-20">
          <p className="text-[24px] md:text-[34px] font-bold leading-7 md:leading-10 pb-6">
            The Impact and Importance of Tree-Planting Events
          </p>
          <div className="flex w-full gap-7 pb-5">
            <div className="flex gap-2 items-center">
              <IoLocationOutline size={24} color="#666666" />
              <p className="text-[16px] text-[#666666] whitespace-nowrap w-[110px] md:w-[150px] lg:w-[140px] overflow-hidden truncate">
                Berlin, Germany Berlin, Germany
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <PiCalendarDots size={20} color="#666666" />
              <p className="text-[16px] text-[#666666]">23.04.2024</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-9">
            <Image
              src={"/images/plantation-3.jpg"}
              width={500}
              height={400}
              alt=""
              unoptimized
              className="w-full md:w-[380px] lg:w-[500px] h-[286px] lg:h-[400px] rounded-[20px] lg:rounded-[30px]"
            />
            <div>
              <p>
                Trees play a pivotal role in maintaining the balance of our
                planet’s ecosystems. They absorb carbon dioxide (CO2) from the
                atmosphere, produce oxygen, and store carbon in their biomass.
                This makes them a critical tool in fighting global warming.
                Forests, which are composed largely of trees, cover
                approximately 31% of the Earth's land surface, and they absorb
                nearly 2.6 billion tons of CO2 annually. Beyond their ability to
                reduce carbon in the atmosphere, trees are also essential for
                maintaining biodiversity. Forests serve as habitats for 80% of
                the world's terrestrial species, from birds and insects to
                mammals and fungi. By planting trees, we create and restore
                habitats, making tree-planting events an integral part of
                conservation efforts to protect endangered species. Trees also
                help to regulate water cycles, prevent soil erosion, and provide
                shade that can reduce urban heat island effects, making cities
                more livable. Their presence in both rural and urban areas
                offers numerous environmental, economic, and health benefits,
                from cleaner air to energy savings.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
