import Image from "next/image"
import InputField from "./ui/CustomInputFild"
import CustomDate from "./ui/CustomDate";
import CustomButton from "./ui/CustomButton";

export default function LandingPage() {
    return(
        <div className="flex flex-col md:flex-row w-full h-full">
           <div className="flex flex-col w-full items-center px-6 py-[40px]">
          <p className="text-[18px] sm:text-[24px] lg:text-[27px] font-semibold text-center mb-5">Drive for <span className="text-[#306E1D]">1M trees</span> planted by <span className="text-[#8C1515]">Me2We 2025</span></p>
          <Image src="/images/location.png" height={460} width={250} alt="logo" className="w-full" unoptimized/>
          <p className="text-[18px] sm:text-[24px] lg:text-[25px] font-normal text-center py-8">Numbers of Trees planted till date: <span className="py-1 px-3 font-medium text-white bg-[#306E1D] rounded-full">100</span></p>

           </div>
           <div className="flex flex-col w-full shadow-xl shrink-l md:max-w-[348px] lg:max-w-[393px] p-6 gap-4">
            <div className="flex flex-col w-full bg-[#F2FFEE] items-center leading-8 px-7 py-5 gap-4">
                <p className="text-[18px] sm:text-[24px] font-bold">Our Partner</p>
               <Image src="/images/evertreen.png" height={77} width={250} alt="logo" className="w-full" unoptimized/>
            </div>
            <div>
            <p className="text-[18px] sm:text-[22px] font-medium text-center">Click here to learn about</p>
            <p className="text-[18px] sm:text-[22px] text-[#8C1515] font-medium text-center"> Me2We Forecast</p>
            </div>
            <hr className=""/>
            <p className="text-[18px] sm:text-[22px] font-medium text-center">{`Planted a Tree? Let's register it toward our goal!!`}</p>
            <div className="flex flex-col gap-4 w-full">
            <InputField
                name="name"
                placeholder="Enter your name"
                type="text"
                // onChange={(e: any) => {}}
                value={''}
                className="text-[16px] mt-[8px]"
                label={'Name'}
                bgColor='#F4F4F4'
              />
              <InputField
                name="email"
                placeholder="Enter your email"
                type="email"
                // onChange={(e: any) => {}}
                value={''}
                className="text-[16px] mt-[8px]"
                label={'Email'}
                bgColor='#F4F4F4'
              />
              <InputField
                name="cohort"
                placeholder="Enter your cohort"
                type="text"
                // onChange={(e: any) => {}}
                value={''}
                className="text-[16px] mt-[8px]"
                label={'Cohort'}
                bgColor='#F4F4F4'
              />
              <CustomDate
                  label='Date Planted'
                  value={''}
                //   onChange={(newValue: string) => {}}
                />
              <InputField
                name="location"
                placeholder="Enter your location"
                type="text"
                // onChange={(e: any) => {}}
                value={''}
                className="text-[16px] mt-[8px]"
                label={'Location'}
                bgColor='#F4F4F4'
              />
              <div className="flex gap-[10px] border-dashed border items-center border-[#777777] rounded-[10px] p-[15px]">
                <p className="text-nowrap">Attach photo</p>
                <CustomButton
          label="Choose File"
        //   callback={()=>{}}
          className="flex px-2 w-max md:w-full h-max !bg-white !text-[#306E1D] border !border-[#306E1D] hover:!bg-white"
        />
              </div>
              <CustomButton
          label="Submit"
        //   callback={()=>{}}
          className="flex px-2 w-full h-max !bg-[#306E1D] !text-white my-1"
        />
            <hr className=""/>

            </div>
            <div className="flex flex-col px-6 gap-[11px] py-[49px]">
            <p className="text-center">Remember to water the plant & share photos at 30, 60 and 90 days</p>
            <CustomButton
          label="Track My Tree"
        //   callback={()=>{}}
          className="flex px-2 w-full h-max !bg-[#306E1D] !text-white my-1"
        />
        </div>
           </div>
      </div>
    )
}