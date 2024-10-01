"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CustomDate from "./ui/CustomDate";
import CustomButton from "./ui/CustomButton";
import InputField from "./ui/CustomInputFild";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  uploadFile,
  getPlantedTrees,
  getEventsByRegion,
} from "@/app/_actions/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PlacesAutocomplete from "./ui/PlacesAutoComplete";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import Slider from "./ui/Slider";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireStorage } from "@/utils/firebase";
import CustomSelection from "./ui/CustomSelect";
import CustomModal from "./ui/CustomModel";
import { RiCloseCircleLine } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";
import landingBackground from "../../../public/images/landing-bg.png";
import ImageSlider from "./ui/Slider";
import ButtonPrefix from "../../../public/images/btn-logo.png";

interface formDataProps {
  name: string;
  email: string;
  cohort: string;
  datePlanted: string | undefined;
  location: { name: string; latitude: number; longitude: number };
  image: null;
}

const sliderImages = [
  {
    src: "/images/plantation-1.jpg",
    alt: "Plantation 1",
    name: "Roots of Renewal",
    location: "India",
    date: "01.05.2024",
  },
  {
    src: "/images/plantation-2.jpg",
    alt: "Plantation 2",
    name: "Roots of Renewal",
    location: "India",
    date: "01.05.2024",
  },
  {
    src: "/images/plantation-3.jpg",
    alt: "Plantation 3",
    name: "Roots of Renewal",
    location: "India",
    date: "01.05.2024",
  },
  {
    src: "/images/plantation-4.png",
    alt: "Plantation 4",
    name: "Roots of Renewal",
    location: "India",
    date: "01.05.2024",
  },
  {
    src: "/images/plantation-5.png",
    alt: "Plantation 5",
    name: "Roots of Renewal",
    location: "India",
    date: "01.05.2024",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const contrastingColors = [
    "#368a3a",
    "#266329",
    "#4CAF50",
    "#2C8A2E",
    "#306E1D",
  ];

  const initialFormData = {
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
      image: "",
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
    setFormData(initialFormData);
    setIsLoading(false);
  };

  const fetchAllPlantedTrees = async () => {
    const response = await getPlantedTrees();
    if (response.success) {
      setPlantedTrees(response?.data);
    }
  };

  const regionModalData = (
    <div className="h-fit">
      <div className="flex justify-end px-8 py-4 border-b items-center">
        <RiCloseCircleLine
          size={24}
          onClick={handleCloseEventModal}
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-5 w-full px-4 sm:px-8 py-4">
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
        <div className="mb-4 grid grid-cols-2 max-h-[250px] overflow-y-auto sm:grid-cols-3 md:grid-cols-4 gap-4 ">
          {selectedEvent?.images?.map((image: any, index: number) => (
            <div key={index} className="cursor-pointer">
              <Image
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
    </div>
  );

  const imagePreview = (
    <div className="px-4 sm:px-8 py-4">
      <div className="flex gap-3 items-center">
        <FaChevronLeft
          onClick={handleImageModalClose}
          className="flex text-[18px] justify-center items-center text-center cursor-pointer"
        />
        <p className="text-[16px] sm:text-[22px]">Selected Image</p>
      </div>
      <div className="flex items-center py-4 ">
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
  );

  const fetchRegionImage = async (region: any) => {
    const { response } = await getEventsByRegion(region);
    if (response?.success) {
      setRegionData(response?.data);
      setOpenEventModal(true);
    } else {
      toast(response?.message);
    }
  };

  useEffect(() => {
    if (regionData.length > 0) {
      const transformed = transformEvents(regionData);
      setEventsName(transformed); // Set the transformed events
    }
  }, [regionData]);

  useEffect(() => {
    fetchAllPlantedTrees();
  }, []);

  return (
    <div className="overflow-auto">
      <div
        className="flex w-full h-screen bg-cover bg-top bg-no-repeat "
        style={{ backgroundImage: `url(${landingBackground.src})` }}
      >
        <div className="absolute inset-0 opacity-20 bg-black"></div>
        <div className="flex justify-center items-center w-full flex-col gap-7 z-10">
          <p className="w-full text-[#F1B932] font-montserrat text-[19px] sm:text-[40px] lg:text-[64px] font-semibold tracking-[1.1em] text-center">
            Welcome to
          </p>
          <p className="font-montserrat text-[55px] lg:text-[90px] pb-12 font-extrabold leading-[70 px] lg:leading-[109.71px] tracking-[0.1em] text-center text-white">
            PLANT MILLION TREES
          </p>
          {/* <p className="text-[32px] font-light leading-[44.8px] text-center text-[#fff] capitalize">
            Track, manage, and schedule events
          </p> */}

          <CustomButton
            label={"SEE TREE MAP"}
            className="rounded-full w-[280px] h-[70px] font-semibold tracking-wider text-[18px]"
          />
        </div>
      </div>

      {/* <div className="flex flex-col w-full md:w-[65%] lg:w-[73%] items-center px-6 py-[40px]">
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
      </div> */}

      <div className="flex flex-col justify-between w-full h-full max-h-[780px] bg-[#F2F0EB] p-6 text-center">
        <p className="font-bold text-[44px] mt-[108px] mb-[35px]">
          Past Events
        </p>
        <ImageSlider sliderImages={sliderImages} />
      </div>

      <div className="flex flex-col lg:flex-row w-full py-[118px] px-[10px] lg:px-[80px] gap-[100px] sm:gap-0 ">
        <div className="flex flex-col w-full justify-center items-center">
          <div className="flex flex-col gap-[49px] ">
            <div className="flex flex-col">
              <div className="font-bold text-[24px] sm:text-[34px] leading-[29px] sm:leading-[41px] text-center">
                Planted a Tree?{" "}
              </div>
              <div className="font-bold text-[24px] sm:text-[34px] leading-[29px] sm:leading-[41px] text-center">
                Let's register it toward our goal!
              </div>
            </div>
            <div className="flex gap-[15px] sm:gap-[30px] w-[100%]">
              <div className="flex flex-col gap-[10px] w-[50%] sm:w-auto">
                <div>
                  <InputField
                    name="name"
                    placeholder="Name"
                    type="text"
                    onChange={handleChange}
                    value={formData.name}
                    className="text-[16px] mt-[8px] border border-[#999999]"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <InputField
                    name="cohort"
                    placeholder="Cohort"
                    type="text"
                    onChange={handleChange}
                    value={formData.cohort}
                    className="text-[16px] mt-[8px] border border-[#999999]"
                  />
                  {errors.cohort && (
                    <p className="text-red-500 text-sm mt-1">{errors.cohort}</p>
                  )}
                </div>
                <div>
                  <PlacesAutocomplete
                    name="location"
                    className="mt-[8px] w-full border border-[#999999]"
                    placeholder="Location"
                    onChange={handleLocationChange}
                    value={formData.location.name}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-[10px] w-[50%] sm:w-auto">
                <div>
                  <InputField
                    name="email"
                    placeholder="Email"
                    type="email"
                    onChange={handleChange}
                    value={formData.email}
                    className="text-[16px] mt-[8px] border border-[#999999]"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <CustomDate
                    value={formData.datePlanted}
                    onChange={handleDateChange}
                    className="border border-[#999999] mt-1"
                  />
                  {errors.datePlanted && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.datePlanted}
                    </p>
                  )}
                </div>

                <div className="mt-2 ">
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
                    className="flex gap-[10px] border items-center border-[#999999] px-[2px] sm:px-2 h-[45px]"
                  >
                    {!formData.image ? (
                      <div className="flex justify-between items-center w-full cursor-pointer">
                        <p className="text-nowrap ">Attach photo</p>
                        <CustomButton
                          label="Choose File"
                          className="flex sm:mx-4 !bg-[#DDDDDD] text-[12px] sm:text-[16px] sm:!px-4 w-fit !text-black rounded-full border !p-1  -z-10"
                        />
                      </div>
                    ) : (
                      <p className="text-nowrap">{imageName}</p>
                    )}
                  </label>
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-1/2 justify-center items-center mt-6">
            <CustomButton
              label="Submit"
              className={`flex rounded-full w-[210px] h-[50px] !font-semibold my-1 uppercase ${
                isLoading && "pointer-events-none"
              }`}
              callback={handleSubmit}
              interactingAPI={isLoading}
            />
          </div>
        </div>
        <div className="flex flex-col w-full  items-center">
          <p className="text-[34px] font-bold leading-[41px]">Our Partner</p>
          <p className="font-montserrat text-[20px] font-normal leading-[24.38px] text-center mt-[74px] sm:mt-[89px]">
            Click
            <Link href={"https://www.evertreen.com/"} target={"_blank"}>
              <span className="underline text-[#3A8340] mx-1">here</span>
            </Link>
            to learn about Me2We Forecast
          </p>
          <CustomButton
            className="!bg-[#3A8340] text-white text-[28px] w-[300px] sm:w-[352px] h-[88px] rounded-full mt-[61px] sm:mt-[64px]"
            label={"evertreen"}
            prefixIcon={
              <Image src={ButtonPrefix.src} width={36} height={36} alt="" />
            }
          />
        </div>
        <CustomModal
          handleClose={handleCloseEventModal}
          open={openEventModal}
          modelData={regionModalData}
        />
        <CustomModal
          handleClose={handleImageModalClose}
          open={openImageModal}
          modelData={imagePreview}
        />{" "}
      </div>
    </div>
  );
}
