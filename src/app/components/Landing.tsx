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
  updateUserInfo,
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
import { IoCheckbox } from "react-icons/io5";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
const Cookies = require("js-cookie");
interface formDataProps {
  treeName: string;
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

const EventData = [
  {
      "country": "United States",
      "location": {
          "latitude": 37.0902,
          "longitude": -95.7129
      }
  },
  {
      "country": "Canada",
      "location": {
          "latitude": 56.1304,
          "longitude": -106.3468
      }
  },
  {
      "country": "Brazil",
      "location": {
          "latitude": -14.2350,
          "longitude": -51.9253
      }
  },
  {
      "country": "Australia",
      "location": {
          "latitude": -25.2744,
          "longitude": 133.7751
      }
  },
  {
      "country": "India",
      "location": {
          "latitude": 20.5937,
          "longitude": 78.9629
      }
  },
  {
      "country": "China",
      "location": {
          "latitude": 35.8617,
          "longitude": 104.1954
      }
  },
  {
      "country": "Russia",
      "location": {
          "latitude": 61.5240,
          "longitude": 105.3188
      }
  },
  {
      "country": "Mexico",
      "location": {
          "latitude": 23.6345,
          "longitude": -102.5528
      }
  },
  {
      "country": "United Kingdom",
      "location": {
          "latitude": 55.3781,
          "longitude": -3.4360
      }
  },
  {
      "country": "Germany",
      "location": {
          "latitude": 51.1657,
          "longitude": 10.4515
      }
  },
  {
      "country": "France",
      "location": {
          "latitude": 46.6034,
          "longitude": 1.8883
      }
  },
  {
      "country": "Italy",
      "location": {
          "latitude": 41.8719,
          "longitude": 12.5674
      }
  },
  {
      "country": "Spain",
      "location": {
          "latitude": 40.4637,
          "longitude": -3.7492
      }
  },
  {
      "country": "South Africa",
      "location": {
          "latitude": -30.5595,
          "longitude": 22.9375
      }
  },
  {
      "country": "Japan",
      "location": {
          "latitude": 36.2048,
          "longitude": 138.2529
      }
  },
  {
      "country": "South Korea",
      "location": {
          "latitude": 35.9078,
          "longitude": 127.7669
      }
  },
  {
      "country": "Nigeria",
      "location": {
          "latitude": 9.0820,
          "longitude": 8.6753
      }
  },
  {
      "country": "Argentina",
      "location": {
          "latitude": -38.4161,
          "longitude": -63.6167
      }
  },
  {
      "country": "Egypt",
      "location": {
          "latitude": 26.8206,
          "longitude": 30.8025
      }
  },
  {
      "country": "Turkey",
      "location": {
          "latitude": 38.9637,
          "longitude": 35.2433
      }
  },
  {
      "country": "Saudi Arabia",
      "location": {
          "latitude": 23.8859,
          "longitude": 45.0792
      }
  },
  {
      "country": "Indonesia",
      "location": {
          "latitude": -0.7893,
          "longitude": 113.9213
      }
  },
  {
      "country": "Pakistan",
      "location": {
          "latitude": 30.3753,
          "longitude": 69.3451
      }
  },
  {
      "country": "Thailand",
      "location": {
          "latitude": 15.8700,
          "longitude": 100.9925
      }
  },
  {
      "country": "Colombia",
      "location": {
          "latitude": 4.5709,
          "longitude": -74.2973
      }
  }
]


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
    treeName: "",
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
      treeName: "",
      cohort: "",
      datePlanted: "",
      location: "",
      image: "",
    };

    if (!formData.treeName) {
      newErrors.treeName = "Name is required";
      isValid = false;
    } else if (formData.treeName.length > 35) {
      newErrors.treeName = "Name must be 35 characters or less";
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
    if (name === "treeName" && value.length > 35) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        treeName: "Name must be 35 characters or less",
      }));
      return;
    }

    // if (name === "email" && value.length > 35) {
    //   setErrors((prevErrors: any) => ({
    //     ...prevErrors,
    //     email: "Email must be 35 characters or less",
    //   }));
    //   return;
    // }

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
    const user = JSON.parse(Cookies.get("user"));
    const token = user?.accessToken;
    const userId = user?.userId;

    if (!token) {
      router.push("/login");
      return;
    }

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
      const data = {
        ...finalUserDetails,
        userId: userId,
      };

      try {
        const res = await updateUserInfo(JSON.stringify(data));

        if (res?.success) {
          toast.success("Plant tree successfully.");
        }
      } catch (error) {
        console.log(error);
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
        <div className="mb-4 grid grid-cols-2 max-h-[250px] sm:grid-cols-3 md:grid-cols-4 gap-4 ">
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
    <div>
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

      <div className="flex flex-col w-full justify-center items-center md:w-[65%] lg:w-[73%] px-6 pt-[40px] sm:pt-[96px] pb-[74px] sm:pb-[104px] m-auto relative">
        <div className="text-[34px] sm:text-[44px] font-bold leading-[41px] sm:leading-[53px] text-center">
          Drive for <span className="underline">1M trees</span> planted by Me2We
          2030
        </div>

        <ComposableMap className="flex justify-center items-center">
          <Geographies geography="https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson">
            {({ geographies }) =>
              geographies.map((geo: any) => {
                return (
                  <>
                    <Geography
                      key={geo.id}
                      geography={geo}
                      style={{
                        default: { fill: "#EBEFF2" },
                        hover: { fill: "#EBEFF2" },
                        pressed: { fill: "#8C1515" },
                      }}
                      onClick={() => {
                        fetchRegionImage(geo.properties.name);
                      }}
                    />
                  </>
                );
              })
            }
          </Geographies>

          {plantedTrees?.map((plant: any, index: number) => {
            const { location } = plant;
            return (
              <Tooltip
                title={`Trees planted: ${plant?.trees?.length}`}
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#fff",
                      color: "#306E1D",
                      fontWeight: "bold",
                      border: "1px solid #306E1D",
                      "& .MuiTooltip-arrow": {
                        color: "transparent",
                      },
                    },
                  },
                }}
              >
                <Marker
                  key={index}
                  coordinates={[location?.longitude, location?.latitude]}
                >
                  <circle
                    r={`${plant?.trees?.length >= 4 ? "5px" : "4px"}`}
                    fill={"#368a3a"}
                  />
                </Marker>
              </Tooltip>
            );
          })}
          {EventData?.map((plant: any, index: number) => {
            const { location } = plant;
            return (
              <Tooltip
                title={`Events: ${plant?.trees?.length || 1}`}
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#fff",
                      color: "#F1B932",
                      fontWeight: "bold",
                      border: "1px solid #F1B932",
                      "& .MuiTooltip-arrow": {
                        color: "transparent",
                      },
                    },
                  },
                }}
              >
                <Marker
                  key={index}
                  coordinates={[location?.longitude, location?.latitude]}
                >
                  <circle
                    r={`${plant?.trees?.length >= 4 ? "5px" : "4px"}`}
                    fill={"#F1B932"}
                  />
                </Marker>
              </Tooltip>
            );
          })}
        </ComposableMap>

        <div className="absolute left-0 bottom-[25%] ml-5">
          <div className="flex gap-3 items-center justify-start">
            {EventData?.length ? <IoCheckbox /> : <MdCheckBoxOutlineBlank />}
            <div className="rounded-full border bg-[#F1B932] size-4" />
            <p className=" text-[12px] sm:text-[18px] font-medium">Events</p>
          </div>
          <div className="flex gap-3 items-center justify-start">
            {plantedTrees?.length ? <IoCheckbox /> : <MdCheckBoxOutlineBlank />}

            <div className="rounded-full border bg-[#368a3a] size-4" />
            <p className=" text-[12px] sm:text-[18px] font-medium">Planted Tress</p>
          </div>
        </div>

        <div className="font-semibold text-[22px] sm:text-[32px] leading-[26px] sm:leading-[39px] text-center">
          Numbers of Trees planted till date:{" "}
          <span className="text-[#3BAD49]">1,000</span> 
        </div>
      </div>

      <div className="flex flex-col  w-full h-full max-h-[780px] bg-[#F2F0EB] p-6 text-center">
        <p className="font-bold text-[44px] mt-[50px] sm:mt-[108px] mb-[45px]">
          Past Events
        </p>
        <ImageSlider sliderImages={sliderImages} />
      </div>

      <div className="flex flex-col lg:flex-row w-full py-[118px] px-[10px] lg:px-[80px] gap-[100px] lg:gap-0 ">
        <div className="flex flex-col w-full justify-center items-center">
          <div className="flex flex-col gap-[49px]">
            <div className="flex flex-col">
              <div className="font-bold text-[24px] sm:text-[34px] leading-[29px] sm:leading-[41px] text-center">
                Planted a Tree?{" "}
              </div>
              <div className="font-bold text-[24px] sm:text-[34px] leading-[29px] sm:leading-[41px] text-center">
                Let's register it toward our goal!
              </div>
            </div>
            <div className="flex gap-[15px] sm:gap-[30px] w-[100%]">
              <div className="flex flex-col gap-[10px] w-[50%] ">
                <div>
                  <InputField
                    name="treeName"
                    placeholder="Name"
                    type="text"
                    onChange={handleChange}
                    value={formData.treeName}
                    className="text-[16px] mt-[8px] border border-[#999999] sm:w-[298px]"
                    bgColor="#F4F4F4"
                  />
                  {errors.treeName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.treeName}
                    </p>
                  )}
                </div>
                <div>
                  <InputField
                    name="cohort"
                    placeholder="Cohort"
                    type="text"
                    onChange={handleChange}
                    value={formData.cohort}
                    className="text-[16px] mt-[8px] border border-[#999999]  sm:w-[298px]"
                  />
                  {errors.cohort && (
                    <p className="text-red-500 text-sm mt-1">{errors.cohort}</p>
                  )}
                </div>
                <div>
                  <PlacesAutocomplete
                    name="location"
                    className="mt-[8px] border border-[#999999] sm:w-[298px]"
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
              <div className="flex flex-col gap-[10px] w-[50%] ">
                {/* <div>
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
                </div> */}
                <div>
                  <CustomDate
                    value={formData.datePlanted}
                    onChange={handleDateChange}
                    className="border border-[#999999] mt-[9px] sm:w-[298px] !h-[48px] "
                  />
                  {errors.datePlanted && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.datePlanted}
                    </p>
                  )}
                </div>

                <div className="mt-2 sm:w-[298px]">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden "
                    id="plant-image"
                    name="image"
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="plant-image"
                    className="flex gap-[10px] border items-center border-[#999999] px-[2px] sm:px-2 h-[48px]"
                  >
                    {!formData.image ? (
                      <div className="flex justify-between items-center w-full cursor-pointer">
                        <p className="text-nowrap text-[#555555] font-normal">
                          Attach photo
                        </p>
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
            className="!bg-[#3A8340] text-white text-[28px] w-[300px] sm:w-[352px] h-[88px] rounded-full  mt-[61px] sm:mt-[64px]"
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
