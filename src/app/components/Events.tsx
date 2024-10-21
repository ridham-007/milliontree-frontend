"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { GoDash, GoPlus } from "react-icons/go";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { addUpdateEvent, getGroupByEvents } from "../_actions/actions";
import { Hidden, Typography } from "@mui/material";
import CustomModal from "./ui/CustomModel";
import { IoMdClose } from "react-icons/io";
import { RiCloseCircleLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { fireStorage } from "@/utils/firebase";
import Button from "@mui/material/Button";

import { IconButton, Modal } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useRouter } from "next/navigation";
import CustomButton from "./ui/CustomButton";
const Cookies = require("js-cookie");

// const CustomButton = dynamic(() => import("../components/ui/CustomButton"), { ssr: false });
interface eventProps {
  queryParams?: any;
}
export default function Events({ queryParams }: eventProps) {
  const [groupEvents, setGroupEvents] = useState<any>({});
  const [eventData, setEventData] = useState<any>();
  const [openUploadImageModel, setOpenUploadImageModel] = useState(false);
  const [imageFiles, setImageFiles] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [galleryImage, setGalleryImage] = useState([]);
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const router = useRouter();

  const handleUploadImageModelOpen = (event: any) => {
    setOpenUploadImageModel(true);
    setEventData(event);
  };

  const handleUploadImageModelClose = () => {
    setOpenUploadImageModel(false);
    setEventData({});
  };

  const handleAddEventClick = () => {
    const queryString = new URLSearchParams({
      // ...queryParams,
      tab: "event",
    }).toString();

    router.push(`/admin?${queryString}`);
  };

  const handleEventDataChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event && event.target) {
      const { name, value, type, files } = event.target;
      if (type === "file" && files) {
        const fileArray = Array.from(files); // Convert FileList to array

        // const fileNames = fileArray.map((file) => file.name); // Store file names as strings
        const fileUrls = fileArray.map((file) => URL.createObjectURL(file));

        setEventData((prevData: any) => ({
          ...prevData,
          // images: [...prevData.images, ...fileNames],
          images: [...prevData.images, ...fileUrls],
        }));
      }
      if (files && files[0]) {
        const file = files[0];
        setImageFiles((prev: any) => [...prev, file]);
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setEventData((prevData: any) => ({
      ...prevData,
      images: prevData.images.filter(
        (cur: any, index: any) => index !== indexToRemove
      ),
    }));
    setImageFiles((prevFiles: any) =>
      prevFiles.filter((_cur: any, index: number) => index !== indexToRemove)
    );
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalUserDetails = { ...eventData };
    const validImages = eventData.images.filter(
      (image: any) => !image.startsWith("blob:")
    );

    if (imageFiles && imageFiles?.length > 0) {
      try {
        const uploadedImages = await Promise.all(
          imageFiles?.map(async (image: any) => {
            const { url } = await uploadFile("planted-tree", image);
            return url; // Return the uploaded URL
          })
        );
        // finalUserDetails = { ...eventData, images: uploadedImages }; // Set the array of image URLs
        finalUserDetails = {
          ...eventData,
          images: [...validImages, ...uploadedImages], // Combine old and new images
        };
      } catch (error) {
        console.error("Error uploading image file(s):", error);
        setLoading(false);
        return;
      }
    }
    try {
      const response = await addUpdateEvent(finalUserDetails);
      if (response?.success) {
        setEventData({});
        setLoading(false);
        setOpenUploadImageModel(false);
        fetchGroupEvents();
        toast(response?.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const modelData = (
    <>
      <div className="flex justify-between px-8 py-4 border-b items-center">
        <p className="text-[22px] font-semibold">Event images</p>
        <RiCloseCircleLine
          size={24}
          onClick={handleUploadImageModelClose}
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-5 w-full px-8 py-4">
        <div>
          <input
            type="file"
            accept="image/*"
            multiple // Allow multiple image uploads
            className="hidden w-full sm:w-max"
            id="plant-image"
            name="images"
            onChange={handleEventDataChange}
          />
          <label
            htmlFor="plant-image"
            className="flex w-full gap-[10px] justify-center border-dashed border items-center border-[#777777] rounded-[10px] p-[40px] mt-1"
          >
            <p className="text-nowrap">Attach photo</p>
            <CustomButton
              label="Choose File"
              className="flex px-2 w-full sm:w-max h-max !bg-white !text-[#306E1D] border !border-[#306E1D] hover:!bg-white -z-10"
            />
          </label>
        </div>
        <div className="flex h-full w-full border rounded-lg p-2">
          <div className="flex flex-wrap justify-center w-full h-[155px] overflow-y-auto gap-2 custom-scrollbar p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {eventData &&
                eventData?.images?.map((imageUrl: any, index: number) => (
                  <div
                    key={index}
                    className="flex gap-2 w-max h-max items-center bg-[#d0cfcf] rounded-xl relative"
                  >
                    <Image
                      src={imageUrl}
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="w-full sm:w-[140px] h-[140px] object-cover rounded-xl transition-opacity duration-300" // Add any styles for image preview
                    />
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-xl" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="ml-2 text-white rounded-full p-[2px] bg-white absolute top-2 right-2"
                    >
                      <IoMdClose size={16} color="gray" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end pt-4">
          <CustomButton
            label="Save"
            className="flex px-2 !w-[70px] h-[42px] !bg-[#306E1D] !text-white border !border-[#306E1D]"
            callback={handleSave}
            interactingAPI={loading}
          />
        </div>
      </div>
    </>
  );

  useEffect(() => {
    fetchGroupEvents();
  }, []);

  const [expandedMonths, setExpandedMonths] = useState<{
    [yearIndex: number]: { [monthIndex: number]: boolean };
  }>({
    0: { 0: true },
  });

  const [expandedYears, setExpandedYears] = useState<{
    [key: number]: boolean;
  }>({
    0: true,
  });

  const [expandedCompletedMonths, setExpandedCompletedMonths] = useState<{
    [key: number]: boolean;
  }>({
    0: true,
  });

  const [expandedCompletedYears, setExpandedCompletedYears] = useState<{
    [key: number]: boolean;
  }>({
    0: true,
  });

  const handleToggleMonth = (yearIndex: number, monthIndex: number) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [yearIndex]: {
        ...prev[yearIndex],
        [monthIndex]: !prev[yearIndex]?.[monthIndex],
      },
    }));
  };
  const handleToggleCompletedMonth = (monthIndex: number) => {
    setExpandedCompletedMonths((prev) => ({
      ...prev,
      [monthIndex]: !prev[monthIndex],
    }));
  };

  const handleToggleYear = (yearIndex: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [yearIndex]: !prev[yearIndex],
    }));
  };
  const handleToggleCompletedYear = (yearIndex: number) => {
    setExpandedCompletedYears((prev) => ({
      ...prev,
      [yearIndex]: !prev[yearIndex],
    }));
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const fetchGroupEvents = async () => {
    const response = await getGroupByEvents();
    if (response.success) {
      setGroupEvents(response?.data);
    }
  };

  const formatDate = (dateString: string, month: any): string => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad with 0 if needed

    return `${day} ${month}`;
  };

  const openGallery = () => setIsOpen(true);

  // Close Modal
  const closeGallery = () => setIsOpen(false);

  const goNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImage.length);
        setIsAnimating(false);
      }, 100); // Duration of the animation
    }
  };

  // Go to Previous Image
  const goPrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(
          (prevIndex) =>
            (prevIndex - 1 + galleryImage.length) % galleryImage.length
        );
        setIsAnimating(false);
      }, 100);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-[64px] ">
      <div className="flex justify-center items-center w-full px-[10px] flex-col max-w-[1280px] self-center">
        <div className="w-full relative z-30 ">
          <Image
            src={"/images/event-banner.webp"}
            width={350}
            height={350}
            alt=""
            unoptimized
            className="w-full h-[280px] sm:h-[350px] rounded-[40px] "
          />
          <p className="w-full top-32 text-[34px] sm:text-[44px] font-bold absolute text-white text-center tracking-[12px]">
            EVENT
          </p>
        </div>
      </div>
      {/*  Upcoming events */}
      <div className="flex flex-col w-full gap-4 sm:gap-6 px-[10px] md:px-[80px]">
        {user?.userRole === "admin" && (
          <div
            className={`${
              user?.userRole !== "admin" ? "hidden" : "flex"
            } sm:justify-end w-full gap-3`}
          >
            <CustomButton
              label="Add event"
              className="rounded-lg font-semibold text-[18px]"
              onClick={handleAddEventClick}
            />
          </div>
        )}
        <div className="font-bold text-[22px] sm:text-[32px] leading-[26px] sm:leading-[39px]">
          Upcoming events
        </div>
        <div className="flex flex-col w-full">
          {groupEvents?.upcoming?.map((cur: any, yearIndex: number) => {
            return (
              <Accordion
                expanded={expandedYears[yearIndex] || false}
                key={cur.year}
                className="border-t-[1px] border-[#666666]"
                sx={{
                  ".css-15v22id-MuiAccordionDetails-root": {
                    padding: 0,
                  },
                  ".css-llkuq-MuiAccordionDetails-root": {
                    padding: 0,
                  },
                  ".css-5ritna-MuiAccordionDetails-root": {
                    padding: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    expandedYears[yearIndex] ? (
                      <GoDash className="text-[20px] sm:text-[22px]text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                    ) : (
                      <GoPlus className="text-[20px] sm:text-[22px]text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                    )
                  }
                  onClick={() => handleToggleYear(yearIndex)}
                  aria-controls={`panel-${yearIndex}-content`}
                  id={`panel-${yearIndex}-header`}
                >
                  <Typography className="font-bold text-[18px] sm:text-[20px] leading-[24px]">
                    {cur.year}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    ".css-15v22id-MuiAccordionDetails-root": {
                      padding: 0,
                    },
                    ".css-llkuq-MuiAccordionDetails-root": {
                      padding: 0,
                    },
                    ".css-1pxj72g-MuiAccordionDetails-root": {
                      padding: 0,
                    },
                    ".css-1faarcj-MuiAccordionDetails-root": {
                      padding: 0,
                    },
                  }}
                >
                  <Typography>
                    {cur.months.map((month: any, monthIndex: number) => (
                      <div
                        key={monthIndex}
                        className="border-t-[1px] border-[#666666]"
                      >
                        <Accordion
                          expanded={
                            expandedMonths[yearIndex]?.[monthIndex] || false
                          }
                          onChange={() =>
                            handleToggleMonth(yearIndex, monthIndex)
                          }
                        >
                          <AccordionSummary
                            expandIcon={
                              expandedMonths[yearIndex]?.[monthIndex] ? (
                                <GoDash className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                              ) : (
                                <GoPlus className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                              )
                            }
                            aria-controls={`panel-${monthIndex}-content`}
                            id={`panel-${monthIndex}-header`}
                          >
                            <Typography className="font-bold text-[18px] leading-[21px]">
                              {month.month}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography
                              sx={{
                                ".css-1pxj72g-MuiAccordionDetails-root": {
                                  padding: 0,
                                },
                              }}
                            >
                              <div className="flex flex-col w-full overflow-x-auto custom-scrollbar  text-[14px] sm:text-[16px] px-2 sm:px-0">
                                <div className="min-w-[500px]">
                                  {month?.events?.map(
                                    (event: any, eventIndex: any) => (
                                      <div
                                        key={eventIndex}
                                        className="flex w-full gap-3 sm:justify-between border-t-[1px] border-[#666666] py-2 items-center"
                                      >
                                        <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                          {formatDate(
                                            event?.startDate,
                                            month?.month
                                          )}
                                        </div>
                                        <div className="w-full sm:max-w-[300px] font-bold leading-[19px] text-center">
                                          {event?.eventName}
                                        </div>
                                        <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                          {event?.region}
                                        </div>
                                        <div className="flex items-center pr-4">
                                          {event?.images?.length > 0 ? (
                                            <Button
                                              onClick={() => {
                                                openGallery();
                                                setGalleryImage(
                                                  event?.images || []
                                                );
                                              }}
                                            >
                                              <CollectionsIcon
                                                sx={{
                                                  color: "#000",
                                                }}
                                              />
                                            </Button>
                                          ) : (
                                            <div className="w-max min-w-16"></div>
                                          )}
                                          <div className="flex justify-end w-full sm:max-w-[300px]">
                                            <CustomButton
                                              label="Upload Image"
                                              className={""}
                                              callback={() => {
                                                handleUploadImageModelOpen(
                                                  event
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </div>

      {/* Completed events */}
      <div className="flex flex-col w-full gap-4 sm:gap-6 px-[10px] md:px-[80px] mb-[100px]">
        <div className="font-bold text-[22px] sm:text-[32px] leading-[26px] sm:leading-[39px]">
          Completed events
        </div>
        <div className="flex flex-col w-full">
          {groupEvents?.completed?.map((cur: any, yearIndex: number) => (
            <Accordion
              key={cur.year}
              expanded={expandedCompletedYears[yearIndex]}
              className="border-t-[1px] border-[#666666]"
              sx={{
                ".css-ugwo3b-MuiAccordionDetails-root": {
                  padding: "0",
                },
                ".css-siypus-MuiAccordionDetails-root": {
                  padding: "0",
                },
                ".css-orow76-MuiAccordionDetails-root": {
                  padding: "0",
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  expandedCompletedYears[yearIndex] ? (
                    <GoDash className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                  ) : (
                    <GoPlus className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                  )
                }
                onClick={() => handleToggleCompletedYear(yearIndex)}
                aria-controls={`panel-${yearIndex}-content`}
                id={`panel-${yearIndex}-header`}
              >
                <Typography className="font-bold text-[20px] leading-[24px]">
                  {cur.year}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  ".css-ugwo3b-MuiAccordionDetails-root": {
                    padding: "0",
                  },
                  ".css-15v22id-MuiAccordionDetails-root": {
                    padding: "0",
                  },
                }}
              >
                <Typography>
                  {cur?.months?.map((month: any, monthIndex: number) => (
                    <div
                      key={monthIndex}
                      className="border-t-[1px] border-[#666666]"
                    >
                      <Accordion
                        expanded={expandedCompletedMonths[monthIndex]}
                        onChange={() => handleToggleCompletedMonth(monthIndex)}
                      >
                        <AccordionSummary
                          expandIcon={
                            expandedCompletedMonths[monthIndex] ? (
                              <GoDash className="text-[20px] sm:text-[22px]text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                            ) : (
                              <GoPlus className="text-[20px] sm:text-[22px]text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                            )
                          }
                          aria-controls={`panel-${monthIndex}-content`}
                          id={`panel-${monthIndex}-header`}
                        >
                          <Typography className="font-bold text-[18px] leading-[21px]">
                            {month?.month}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div className="flex flex-col w-full overflow-x-auto custom-scrollbar  text-[14px] sm:text-[16px] px-2 sm:px-0">
                              <div className="min-w-[500px]">
                                {month?.events?.map(
                                  (event: any, eventIndex: any) => (
                                    <div
                                      key={eventIndex}
                                      className="flex w-full gap-3 sm:justify-between border-t-[1px] border-[#666666] py-2 items-center"
                                    >
                                      <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                        {formatDate(
                                          event?.startDate,
                                          month?.month
                                        )}
                                      </div>
                                      <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                        {event?.eventName}
                                      </div>
                                      <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                        {event?.region}
                                      </div>
                                      {/* <div className="w-full font-normal leading-[19px] text-center"></div> */}
                                      <div className="flex items-center">
                                        {event?.images?.length > 0 ? (
                                          <Button
                                            onClick={() => {
                                              openGallery();
                                              setGalleryImage(
                                                event?.images || []
                                              );
                                            }}
                                          >
                                            <CollectionsIcon
                                              sx={{
                                                color: "#000",
                                              }}
                                            />
                                          </Button>
                                        ) : (
                                          <div className="w-max min-w-16"></div>
                                        )}
                                        <div className="w-full sm:max-w-[300px] gap-4 mr-4">
                                          <CustomButton
                                            label="Upload Image"
                                            className={""}
                                            callback={() => {
                                              handleUploadImageModelOpen(event);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  ))}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>

      <Modal
        open={isOpen}
        onClose={() => {
          closeGallery();
          setGalleryImage([]);
        }}
      >
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <IconButton
              className="!absolute top-5 right-5 !text-white z-10"
              onClick={closeGallery}
            >
              <CloseIcon fontSize="large" />
            </IconButton>

            <IconButton
              className="!absolute left-5 top-1/2 transform -translate-y-1/2 !text-white z-10"
              onClick={goPrev}
            >
              <ArrowBackIosIcon fontSize="large" />
            </IconButton>

            <div className="relative w-full f-full overflow-hidden">
              <div
                className={` w-full h-full transition-transform duration-500 transform`}
              >
                <Image
                  src={galleryImage[currentIndex]}
                  alt={`image-${currentIndex}`}
                  className="!w-full !h-full rounded-lg"
                  unoptimized
                  width={100}
                  height={100}
                  objectFit="cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/plantation-1.jpg";
                  }}
                />
              </div>
            </div>

            <IconButton
              className="!absolute right-5 top-1/2 transform -translate-y-1/2 !text-white z-10"
              onClick={goNext}
            >
              <ArrowForwardIosIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      </Modal>
      <CustomModal
        handleClose={handleUploadImageModelClose}
        open={openUploadImageModel}
        modelData={modelData}
      />
    </div>
  );
}
