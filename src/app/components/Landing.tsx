"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import CustomDate from "./ui/CustomDate";
import CustomButton from "./ui/CustomButton";
import InputField from "./ui/CustomInputFild";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFile,getPlantedTrees, getEventsByRegion } from "@/app/_actions/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PlacesAutocomplete from "./ui/PlacesAutoComplete";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Slider from "./ui/Slider";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireStorage } from "@/utils/firebase";
import CustomSelection from "./ui/CustomSelect";
import CustomModal from "./ui/CustomModel";
import { RiCloseCircleLine } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";


interface formDataProps {
  name: string;
  email: string;
  cohort: string;
  datePlanted: string | undefined;
  location: { name: string; latitude: number; longitude: number };
  image: null;
}

const sliderImage = [
  {key:1,image:<Image src={'/images/plantation-1.jpg'} height={150} width={200} alt="" className="w-[200px] h-[150px] mx-4" unoptimized/>},
  {key:2,image:<Image src={'/images/plantation-2.jpg'} height={150} width={200} alt="" className="w-[200px] h-[150px] mx-4" unoptimized/>},
  {key:3,image:<Image src={'/images/plantation-3.jpg'} height={150} width={200} alt="" className="w-[200px] h-[150px] mx-4" unoptimized/>},
  {key:4,image:<Image src={'/images/plantation-4.png'} height={150} width={200} alt="" className="w-[200px] h-[150px] mx-4" unoptimized/>},
  {key:5,image:<Image src={'/images/plantation-5.png'} height={150} width={200} alt="" className="w-[200px] h-[150px] mx-4" unoptimized/>}
]

export default function LandingPage() {
  const router = useRouter();
  const contrastingColors = ["#368a3a", "#266329", "#4CAF50", "#2C8A2E", "#306E1D"];

  const initialFormData ={
    name: "",
    email: "",
    cohort: "",
    datePlanted: "",
    location: { name: "", latitude: 0, longitude: 0 },
    image: null,
  };
  const [formData, setFormData] = useState<formDataProps>(initialFormData);
  const [errors, setErrors] = useState<any>({});
  const [plantedTrees, setPlantedTrees] = useState([]);
  const [imageName, setImageName] = useState<any>("");
  const [isLoading, setIsLoading] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [regionData, setRegionData] = useState<any[]>([]);
const [eventsName, setEventsName] = useState<any[]>([]);
const [selectedEvent, setSelectedEvent] = useState<any>(
  eventsName?.[0] || null
);
const [openEventModal, setOpenEventModal] = useState<any>(false);
const [selectedImage, setSelectedImage] = useState<string | null>(null);
const [openImageModal, setOpenImageModal] = useState(false);

const handleImageModalOpen = (imageSrc: string) => {
  setSelectedImage(imageSrc);
  setOpenImageModal(true);
};

const handleImageModalClose = () => {
  setOpenImageModal(false);
  setSelectedImage(null);
};

const transformEvents = (events: any[]) => {
  return events?.map((event: any) => {
    return {
      label: event?.eventName,
      value: event?.eventName,
      images: event?.images,
    };
  });
};

  const handleCloseEventModal = () => { 
    setOpenEventModal(false);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      cohort: "",
      datePlanted: "",
      location: "",
      image:"",
    };

    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length > 35) {
      newErrors.name = "Name must be 35 characters or less";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (formData.email.length > 35) {
      newErrors.email = "Email must be 35 characters or less";
      isValid = false;
    }

    if (!formData.cohort) {
      newErrors.cohort = "Cohort is required";
      isValid = false;
    } else if (formData.cohort.length > 35) {
      newErrors.cohort = "Cohort must be 35 characters or less";
      isValid = false;
    }

    if (!formData.datePlanted) {
      newErrors.datePlanted = "Date Planted is required";
      isValid = false;
    }

    if (!formData.location.name) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: any) => {
    const { name, value, type, files } = e.target;
    if (name === "name" && value.length > 35) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        name: "Name must be 35 characters or less",
      }));
      return;
    }

    if (name === "email" && value.length > 35) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        email: "Email must be 35 characters or less",
      }));
      return;
    }

    if (name === "cohort" && value.length > 35) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        cohort: "Cohort must be 35 characters or less",
      }));
      return;
    }

    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: "",
    }));
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setImageName(files[0]?.name);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  const handleLocationChange = (
    event: any,
    data: {
      location: string;
      latitude: number;
      longitude: number;
      placeId: string;
    }
  ) => {
    if (!data.location) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        location: "Location is required",
      }));
    } else {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        location: "",
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        location: {
          name: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      }));
    }
  };

  const handleDateChange = (newValue: any) => {
    if (!newValue) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        datePlanted: "Date Planted is required",
      }));
    } else {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        datePlanted: "",
      }));
    }
    setFormData((prevData) => ({
      ...prevData,
      datePlanted: newValue,
    }));
  };

  const handleRedirectOnTrack = () => {
    setLoading(true);
    router.push(`/search-tree`);
    setLoading(false);
  };

  const uploadFile = async (
    bucket: string,
    file: File
  ): Promise<{ url: string; name: string }> => {
    try {
      return new Promise(async (resolve, reject) => {
        if (!file) resolve({ url: "", name: "" });
        const fileName = file.name || `${uuidv4()}`;
        const storageRef = ref(fireStorage, `${bucket}/${fileName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        resolve({ url, name: file.name });
      });
    } catch (e) {
      throw e;
    }
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalUserDetails),
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const res = await response.json();
      if (res?.message) {
        toast(res?.message);
        router.push(`/search-tree`);
      } else {
        toast.error("Unexpected response from the server");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setFormData(initialFormData)
    setIsLoading(false);
  };

  const fetchAllPlantedTrees = async () => {
    const response = await getPlantedTrees();
    if (response.success) {
      setPlantedTrees(response?.data);
    }
  };

  const regionModalData = (
    <>
    <div className="flex justify-end px-8 py-4 border-b items-center">
      <RiCloseCircleLine size={24} onClick={handleCloseEventModal} className="cursor-pointer"/>
    </div>
    <div className="flex flex-col gap-5 w-full px-8 py-4">
    <CustomSelection
              name="eventName"
              data={eventsName}
              errorMessage={"message"}
              className="h-[48px] mt-[8px] flex items-center"
              placeholder={"Select Timezone"}
              label="Event Name"
              value={selectedEvent}
              onChange={setSelectedEvent}
            />
             <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {selectedEvent?.images?.map((image:any, index:number) => (
    <div key={index} className="cursor-pointer">
      <img
        src={image}
        width={150}
        height={150}
        alt={image.alt}
        onClick={() => handleImageModalOpen(image)}
        className="w-full h-auto object-fill"
      />
    </div>
  ))}
</div>
    </div>
    </>
  )

  const imagePreview = (
    <div className="px-8 py-4">
    <div className="flex gap-3 items-center">
    <FaChevronLeft
      onClick={handleImageModalClose}
      className="flex text-[18px] justify-center items-center text-center cursor-pointer"
    />
    <Typography
      id="modal-modal-title"
      variant="h6"
      component="h2"
      className="text-center"
    >
      Selected Image
    </Typography>
  </div>
  <div className="flex items-center py-4">
    {selectedImage && (
      <Image
        src={selectedImage}
        width={500}
        height={500}
        alt="Selected Image"
        className="w-full h-auto"
      />
    )}
  </div>
  </div>
  )

  const fetchRegionImage = async (region:any) => {
    const { response } = await getEventsByRegion(region);
    if (response?.success) {
      setRegionData(response?.data);
      setOpenEventModal(true)
    }else{
      toast(response?.message)
    }
  };

  useEffect(() => {
    if (regionData.length > 0) {
      const transformed = transformEvents(regionData);
      setEventsName(transformed);  // Set the transformed events
    }
  }, [regionData]);

  useEffect(() => {
    fetchAllPlantedTrees();
  },[])

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="flex flex-col w-full md:w-[65%] lg:w-[73%] items-center px-6 py-[40px]">
        <p className="text-[18px] sm:text-[24px] lg:text-[27px] font-semibold text-center mb-5">
          Drive for <span className="text-[#306E1D]">1M trees</span> planted by{" "}
          <span className="text-[#8C1515]">Me2We 2030</span>
        </p>
        <ComposableMap>
          <Geographies geography="https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson">
            {({ geographies }) =>
              geographies.map((geo: any) => {
                return (
                  <>
                    <Geography
                      key={geo.id}
                      geography={geo}
                      style={{
                        default: { fill: '#dbdbdb' },
                        hover: { fill: "#306E1D" },
                        pressed: { fill: "#8C1515" },
                      }}
                      stroke="#306E1D"
                      onClick={()=>{fetchRegionImage(geo.properties.name)}}
                    />
                  </>
                );
              })
            }
          </Geographies>

          {plantedTrees?.map((plant: any, index: number) => {
            const { location } = plant;
            return (
              <Tooltip title={`Trees planted: ${plant?.trees?.length}`} arrow placement='top' componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#fff',
                    color: "#306E1D",
                    fontWeight: "bold",
                    border: "1px solid #306E1D",
                    '& .MuiTooltip-arrow': {
                      color: 'transparent',
                    },
                  },
                },
              }}>
                <Marker
                  key={index}
                  coordinates={[location?.longitude, location?.latitude]}
                >
                  <circle r={4} fill={`${contrastingColors[plant?.trees?.length >= 4 ? 3 : plant?.trees?.length - 1]}`} />
                </Marker>
              </Tooltip>
            );
          })}
        </ComposableMap>

        <p className="text-[18px] sm:text-[24px] lg:text-[25px] font-normal text-center py-8">
          Numbers of Trees planted till date:{" "}
          <span className="py-1 px-3 font-medium text-white bg-[#306E1D] rounded-full">
            1,000
          </span>
        </p>
        <div className="flex flex-col justify-between w-full bg-[#F4F4F4] h-auto md:h-[285px] p-6 text-center mt-0 md:mt-[100px]">
          <Slider sliderImage={sliderImage}/>
          <h2 className="font-semibold text-lg mt-4">
            Photos from LEAD Me2We Forest
          </h2>
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
            <Link href={"https://www.evertreen.com/"} target={"_blank"}>
              {" "}
              Click here to learn about
            </Link>
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
          <div>
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
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
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
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
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
            {errors.cohort && (
              <p className="text-red-500 text-sm mt-1">{errors.cohort}</p>
            )}
          </div>
          <div>
            <CustomDate
              label="Date Planted"
              value={formData.datePlanted}
              onChange={handleDateChange}
            />
            {errors.datePlanted && (
              <p className="text-red-500 text-sm mt-1">{errors.datePlanted}</p>
            )}
          </div>
          <div>
            <PlacesAutocomplete
              name="location"
              className="mt-[8px] w-full rounded-[8px] border border-[#f4f4f4]"
              placeholder="Location of the event?"
              label="Location"
              onChange={handleLocationChange}
              value={formData.location.name}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
          <div>
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
          {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>
          <CustomButton
            label="Submit"
            className={`flex px-2 w-full h-max my-1 ${
              isLoading && "pointer-events-none"
            }`}
            callback={handleSubmit}
            interactingAPI={isLoading}
          />
          <hr />
        </div>
        <div className="flex flex-col px-6 gap-[11px] py-[49px]">
          <p className="text-center">
            Remember to water the plant & share photos at{" "}
            <span className="text-[#306E1D]">30</span>,{" "}
            <span className="text-[#306E1D]">60</span> and{" "}
            <span className="text-[#306E1D]">90 days</span>
          </p>
          <CustomButton
            label="Track My Tree"
            className="flex px-2 w-full h-max !bg-[#306E1D] !text-white my-1"
            callback={handleRedirectOnTrack}
            interactingAPI={loading}
          />
        </div>
        <CustomModal handleClose={handleCloseEventModal} open={openEventModal} modelData={regionModalData}/>
        <CustomModal handleClose={handleImageModalClose} open={openImageModal} modelData={imagePreview}/>
      </div>
    </div>
  );
}
