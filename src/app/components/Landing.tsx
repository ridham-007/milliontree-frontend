"use client";
import React, { useEffect, useRef, useState } from "react";
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
  getAllEvents,
  getCompletedEvents,
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
import landingBackground from "../../../public/images/landing-bg.webp";
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
  const [totalPlantedTrees, setTotalPlantedTrees] = useState<number>(0);
  const [events, setAllEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);

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

  const fetchAllPlantedTrees = async () => {
    const response = await getPlantedTrees();
    if (response.success) {
      setPlantedTrees(response?.data);
    }
  };

  const handleSubmit = async () => {
    // const user = JSON.parse(Cookies.get("user"));
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
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
          router.push("/track-my-tree");
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

  const fetchAllEvents = async () => {
    const response = await getAllEvents();
    if (response.success) {
      setAllEvents(response?.data);
    }
  };

  const fetchCompletedEvents = async () => {
    const response = await getCompletedEvents();
    if (response.success) {
      setCompletedEvents(response?.data);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
    const year = date.getFullYear(); // Get the full year

    return `${day}.${month}.${year}`;
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
    fetchAllEvents();
    fetchCompletedEvents();
  }, []);

  useEffect(() => {
    const total = plantedTrees?.reduce((sum: number, plant: any) => {
      return sum + (plant?.trees?.length || 0);
    }, 0);

    setTotalPlantedTrees(1000 + total || 0); // Update state with the calculated total
  }, [plantedTrees]);

  const mapRef = useRef<HTMLDivElement>(null);

  const handleScrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div
        className="flex w-full h-screen bg-cover bg-top bg-no-repeat "
        style={{ backgroundImage: `url(${landingBackground.src})` }}
      >
        <div className="absolute inset-0 opacity-20 bg-black"></div>
        <div className="flex h-dvh justify-center items-center w-full flex-col gap-7 z-10">
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
            onClick={handleScrollToMap}
          />
        </div>
      </div>

      <div
        className="flex flex-col w-full justify-center gap-10 lg:w-[83%] mx-auto px-8 md:px-[50px] xl:px-[100px] py-14"
        ref={mapRef}
      >
        <div className="font-bold text-[32px] sm:text-[44px] text-center">
          About Us
        </div>
        <div className="flex flex-col gap-4 ">
          <div className=" text-[16px] sm:text-[18px]">
            To unite the Stanford community in a global effort to plant a
            million trees by 2030, promoting sustainability, environmental
            stewardship, and community engagement.
          </div>
          <div className="text-[21px] font-semibold">Vision</div>
          <div className="  text-[16px] sm:text-[18px]">
            Empowered by the Stanford LEAD philosophy of changing organizations,
            changing lives, and changing the world, the
            <Link href={"https://leadme2we.com/"} target={"_blank"}>
              <span className="underline text-[#3A8340] mx-1">
                {" "}
                Stanford Me2We Community
              </span>
            </Link>
            envisions a world where our collective efforts make a tangible
            impact on the environment, creating a better place for future
            generations. We strive to inspire a culture of sustainability and
            social responsibility that extends beyond our campuses, fostering a
            global community that works together to protect and preserve our
            planet.
          </div>
          <div className="text-[21px] font-semibold mt-2">Our Goals</div>
          <div className="  text-[16px] sm:text-[18px]">
            Plant a million trees: Collaborate with local organizations,
            governments, and communities to plant a million trees globally by
            2030. Raise awareness: Educate the Stanford community about the
            importance of reforestation, climate change, and sustainability.
          </div>
          <div className="  text-[16px] sm:text-[18px]">
            Foster community engagement: Encourage Stanford students, alumni,
            and staff to participate in tree-planting events, promoting a sense
            of community and social responsibility.
          </div>
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
                        default: { fill: "#EBEFF2", outline: "none" },
                        hover: { fill: "#EBEFF2", outline: "none" },
                        pressed: { fill: "#8C1515", outline: "none" },
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
          {events?.map((event: any, index: number) => {
            const { latitude, longitude } = event;
            return (
              <Tooltip
                title={`Events: ${event?.eventName || ""}`}
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
                <Marker key={index} coordinates={[longitude, latitude]}>
                  <circle r={`4px`} fill={"#F1B932"} />
                </Marker>
              </Tooltip>
            );
          })}
        </ComposableMap>

        <div className="absolute left-0 bottom-[25%] ml-5">
          <div className="flex gap-3 items-center justify-start">
            {events?.length ? <IoCheckbox /> : <MdCheckBoxOutlineBlank />}
            <div className="rounded-full border bg-[#F1B932] size-4" />
            <p className=" text-[12px] sm:text-[18px] font-medium">Events</p>
          </div>
          <div className="flex gap-3 items-center justify-start">
            {plantedTrees?.length ? <IoCheckbox /> : <MdCheckBoxOutlineBlank />}

            <div className="rounded-full border bg-[#368a3a] size-4" />
            <p className=" text-[12px] sm:text-[18px] font-medium">
              Planted Tress
            </p>
          </div>
        </div>

        <div className="font-semibold text-[22px] sm:text-[32px] leading-[26px] sm:leading-[39px] text-center">
          Numbers of Trees planted till date:{" "}
          <span className="text-[#3BAD49]">{totalPlantedTrees}</span>
        </div>
      </div>

      <div className="flex flex-col  w-full h-full max-h-[780px] bg-[#F2F0EB] p-6 text-center">
        <p className="font-bold text-[44px] mt-[50px] sm:mt-[108px] mb-[45px]">
          Past Events
        </p>
        <ImageSlider
          sliderImages={
            completedEvents?.length > 0
              ? completedEvents?.map((cur: any) => {
                  return {
                    src: cur?.images?.[0] || "/images/plantation-1.jpg",
                    alt: "Plantation 1",
                    name: cur?.eventName,
                    location: cur?.region,
                    date: formatDate(cur?.startDate),
                  };
                })
              : []
          }
        />
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
                    className="hidden"
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
                          className="flex sm:mx-4 !bg-[#DDDDDD] text-[12px] sm:text-[16px] sm:!px-4 w-fit !text-black rounded-full border !p-1 -z-10"
                        />
                      </div>
                    ) : (
                      <p className="text-nowrap">
                        {imageName.length > 32
                          ? `${imageName.slice(0, 32)}...`
                          : imageName}
                      </p>
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
            <Link
              href={"https://www.evertreen.com/forest/66608f4c1a183"}
              target={"_blank"}
            >
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
      </>
  );
}
