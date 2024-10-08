import Image from "next/image";
import { LiaLinkedinIn } from "react-icons/lia";
import { RiYoutubeFill } from "react-icons/ri";

export default function Footer() {
  return (
    <div className="flex flex-col w-full bg-black px-[20px] lg:px-[100px] gap-14 py-5">
      <div className="flex flex-col sm:flex-row w-full justify-between gap-10 md:gap-0">
        <div className="flex w-full md:w-[50%] justify-center md:justify-normal items-center">
          {/* <Image
            src="/images/stanford-white.png"
            height={200}
            width={250}
            alt="logo"
            className="w-[170px] h-[100] md:w-[250px] md:h-[200]"
          /> */}
          <div className="text-white">© 2024 PLANT MILLION TREES</div>
        </div>
        <div className="flex w-full md:w-[50%] items-center justify-between md:justify-end gap-14">
          {/* <p className="text-[32px] font-bold border-b-2 border-b-white text-white">
            Follow us
          </p>
          <p className="text-[15px] text-white text-center">
            Don't be uninformed. Get the latest update
          </p> */}
          <div className="flex gap-2 justify-center mt-3">
            <LiaLinkedinIn
              size={30}
              color="white"
              className="border border-white rounded-full p-1 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/company/plantmilliontrees/",
                  "_blank"
                )
              }
            />

            {/* <RiYoutubeFill
              size={30}
              color="white"
              className="border border-white rounded-full p-1 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/@stanfordleadme2we",
                  "_blank"
                )
              }
            /> */}
          </div>
          <div>
            <Image
              src="/images/stanford-white.png"
              height={200}
              width={250}
              alt="logo"
              className="w-[170px] h-[100] md:w-[250px] md:h-[200]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
