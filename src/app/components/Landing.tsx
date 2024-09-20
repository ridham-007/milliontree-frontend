'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import CustomDate from './ui/CustomDate';
import CustomButton from './ui/CustomButton';
import InputField from './ui/CustomInputFild';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { uploadFile } from '@/app/_actions/actions'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cohort: '',
    datePlanted: '',
    location: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [imageName, setImageName] = useState<any>('');
  const [isLoading, setIsLoading] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);

  const handleChange = (e:any) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setImageName(files[0].name)
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (newValue:any) => {
    setFormData((prevData) => ({
      ...prevData,
      datePlanted: newValue,
    }));
  };

  const validateForm = () => {
    const newErrors:any = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";

    return newErrors;
  };

  const handleRedirectOnTrack = () => {
    setLoading(true)
    const userId = '66ebb503c80d4247cb358a34'; 
    router.push(`/track/${userId}`);
    setLoading(false)
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
  
    let finalUserDetails = {};
    if (formData.image) {
      try {
        const { url } = await uploadFile("planted-tree", formData.image);
        finalUserDetails = { ...formData, images: [{ day: 1, image: url }] };
      } catch (error) {
        console.error("Error uploading image file:", error);
        return;
      }
    } else {
      finalUserDetails = formData;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/user/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalUserDetails),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const res = await response.json();
      if (res?.message) {
        toast(res.message);  
      } else {
        toast.error('Unexpected response from the server');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="flex flex-col w-full items-center px-6 py-[40px]">
        <p className="text-[18px] sm:text-[24px] lg:text-[27px] font-semibold text-center mb-5">
          Drive for <span className="text-[#306E1D]">1M trees</span> planted by{" "}
          <span className="text-[#8C1515]">Me2We 2025</span>
        </p>
        <Image
          src="/images/location.png"
          height={460}
          width={250}
          alt="logo"
          className="w-full"
          unoptimized
        />
        <p className="text-[18px] sm:text-[24px] lg:text-[25px] font-normal text-center py-8">
          Numbers of Trees planted till date:{" "}
          <span className="py-1 px-3 font-medium text-white bg-[#306E1D] rounded-full">
            1,000
          </span>
        </p>
          <div className='flex flex-col w-full bg-[#F4F4F4] h-[285px] p-6 text-center mt-0 md:mt-[100px]'>
            <Image src='/images/home-2.png' width={150} height={150} alt='home' className='w-full' /> 
            <h2 className='font-semibold text-lg mt-4'>Photos from LEAD Me2We Forest</h2>
          </div>
      </div>
      <div className="flex flex-col w-full shadow-xl shrink-l md:max-w-[348px] lg:max-w-[393px] p-6 gap-4">
        <div className="flex flex-col w-full bg-[#F2FFEE] items-center leading-8 px-7 py-5 gap-4">
          <p className="text-[18px] sm:text-[24px] font-bold">Our Partner</p>
          <Image
            src="/images/evertreen.png"
            height={77}
            width={250}
            alt="logo"
            className="w-full"
            unoptimized
          />
        </div>
        <div>
          <p className="text-[18px] sm:text-[22px] font-medium text-center underline">
          <Link href={'https://www.evertreen.com/'}>  Click here to learn about</Link>
          </p>
          <p className="text-[18px] sm:text-[22px] text-[#8C1515] font-medium text-center">
            {" "}
            Me2We Forecast
          </p>
        </div>
        <hr />
        <div>
        <p className="text-[18px] sm:text-[22px] font-medium text-center">{`Planted a Tree?`}</p>
        <p className="text-[18px] sm:text-[22px] font-medium text-center">{` Let's register it toward our goal!!`}</p>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <InputField
            name="name"
            placeholder="Enter your name"
            type="text"
            onChange={handleChange}
            value={formData.name}
            className="text-[16px] mt-[8px]"
            label={"Name"}
            bgColor="#F4F4F4"
          />
          <InputField
            name="email"
            placeholder="Enter your email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            className="text-[16px] mt-[8px]"
            label={"Email"}
            bgColor="#F4F4F4"
          />
          <InputField
            name="cohort"
            placeholder="Enter your cohort"
            type="text"
            onChange={handleChange}
            value={formData.cohort}
            className="text-[16px] mt-[8px]"
            label={"Cohort"}
            bgColor="#F4F4F4"
          />
          <CustomDate
            label="Date Planted"
            value={formData.datePlanted}
            onChange={handleDateChange}
          />
          <InputField
            name="location"
            placeholder="Enter your location"
            type="text"
            onChange={handleChange}
            value={formData.location}
            className="text-[16px] mt-[8px]"
            label={"Location"}
            bgColor="#F4F4F4"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="plant-image"
            name="image"
            onChange={handleChange}
          />
          <label
            htmlFor="plant-image"
            className="flex gap-[10px] border-dashed border items-center border-[#777777] rounded-[10px] p-[15px]"
          >
            {!formData.image ? (
              <>
                <p className="text-nowrap">Attach photo</p>
                <CustomButton
                  label="Choose File"
                  className="flex px-2 w-max md:w-full h-max !bg-white !text-[#306E1D] border !border-[#306E1D] hover:!bg-white -z-10"
                />
              </>
            ) : (
              <p className="text-nowrap">{imageName}</p>
            )}
          </label>
          <CustomButton
            label="Submit"
            className={`flex px-2 w-full h-max my-1 ${isLoading && 'pointer-events-none'}`}
            callback={handleSubmit}
            interactingAPI={isLoading}
          />
          <hr />
        </div>
        <div className="flex flex-col px-6 gap-[11px] py-[49px]">
          <p className="text-center">
            Remember to water the plant & share photos at 30, 60 and 90 days
          </p>
          <CustomButton
            label="Track My Tree"
            className="flex px-2 w-full h-max !bg-[#306E1D] !text-white my-1"
            // callback={handleRedirectOnTrack}
            interactingAPI={loading}
          />
        </div>
      </div>
    </div>
  );
}
