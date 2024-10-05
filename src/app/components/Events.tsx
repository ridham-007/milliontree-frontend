"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GoDash, GoPlus } from "react-icons/go";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { addUpdateEvent, getGroupByEvents } from "../_actions/actions";
import { Typography } from "@mui/material";
import CustomButton from "./ui/CustomButton";
import CustomModal from "./ui/CustomModel";
import { IoMdClose } from "react-icons/io";
import { RiCloseCircleLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { fireStorage } from "@/utils/firebase";


interface imagesProps {
  images: string[];
}
export default function Events() {
  const [groupEvents, setGroupEvents] = useState<any>({});
  const [eventData, setEventData] = useState<any>();
  const [openUploadImageModel, setOpenUploadImageModel] = useState(false);
  const [imageFiles, setImageFiles] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  
  const handleUploadImageModelOpen = (event: any) => {
    setOpenUploadImageModel(true);
    setEventData(event);
  };
  
  const handleUploadImageModelClose = () => {
    setOpenUploadImageModel(false);
    setEventData({})
  };
  console.log({eventData});
  
  const handleEventDataChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event && event.target) {
      const { name, value, type, files } = event.target;
      if (type === 'file' && files) {
        const fileArray = Array.from(files); // Convert FileList to array

        // const fileNames = fileArray.map((file) => file.name); // Store file names as strings
        const fileUrls = fileArray.map((file) => URL.createObjectURL(file));

        setEventData((prevData:any) => ({
          ...prevData,
          // images: [...prevData.images, ...fileNames],
          images: [...prevData.images, ...fileUrls],
        }));
      } 
      if (files && files[0]) {
        const file = files[0];
        setImageFiles((prev: any) => ([
          ...prev,
          file,
        ]));
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setEventData((prevData:any) => ({
      ...prevData,
      images: prevData.images.filter((cur:any, index:any) => index !== indexToRemove),
    }));
    setImageFiles((prevFiles: any) => prevFiles.filter((_cur: any, index: number) => index !== indexToRemove));
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
    const validImages = eventData.images.filter((image: any) => !image.startsWith("blob:"));

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
        setOpenUploadImageModel(false)
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
        <p className="text-[22px] font-semibold">Upload event images</p>
        <RiCloseCircleLine size={24} onClick={handleUploadImageModelClose} className="cursor-pointer" />
      </div>
      <div className="flex flex-col gap-5 w-full px-8 py-4">
        <div>
        <label className="font-semibold">Upload new images</label>
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
          {eventData && (eventData?.images?.map((imageUrl:any, index:number) => (
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
          )))}
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
    fetchGroupEvents()
  }, [])

  const [expandedMonths, setExpandedMonths] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedYears, setExpandedYears] = useState<{
    [key: number]: boolean;
  }>({});

  const [expandedCompletedMonths, setExpandedCompletedMonths] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedCompletedYears, setExpandedCompletedYears] = useState<{
    [key: number]: boolean;
  }>({});

  const handleToggleMonth = (monthIndex: number) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthIndex]: !prev[monthIndex],
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
  return (
    <div className="flex flex-col w-full h-full gap-[64px]">
      <div className="flex justify-center items-center w-full px-[10px] flex-col max-w-[1280px] self-center">
        <div className="w-full relative z-30 ">
          <Image
            src={"/images/event-banner.png"}
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
      <div className="flex flex-col w-full gap-4 sm:gap-6 px-[10px] sm:px-[80px]">
        <div className="font-bold text-[22px] sm:text-[32px] leading-[26px] sm:leading-[39px]">
          Upcoming events
        </div>
        <div className="flex flex-col w-full">
          {groupEvents?.upcoming?.map((cur: any, yearIndex: number) => {
            console.log({cur});
            
            return(
            <Accordion
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
                        expanded={expandedMonths[monthIndex]}
                        onChange={() => handleToggleMonth(monthIndex)}
                      >
                        <AccordionSummary
                          expandIcon={
                            expandedMonths[monthIndex] ? (
                              <GoDash className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                            ) : (
                              <GoPlus className="text-[20px] sm:text-[22px] border-[1px] border-[#000] text-[#000] rounded-full" />
                            )
                          }
                          aria-controls={`panel-${monthIndex}-content`}
                          id={`panel-${monthIndex}-header`}
                        >
                          <Typography className="font-bold text-[18px] leading-[21px] sm:ml-[60px]">
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
                            <div className="flex flex-col w-full text-[14px] sm:text-[16px] px-2 sm:px-0">
                              {month?.events?.map((event: any, eventIndex: any) => (
                                <div
                                  key={eventIndex}
                                  className="flex w-full gap-2 sm:justify-between border-t-[1px] border-[#666666] py-2 items-center"
                                >
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] sm:ml-[60px]">
                                    {formatDate(event?.startDate, month?.month)}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-bold leading-[19px] text-center">
                                    {event?.eventName}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                    {event?.region}
                                  </div>
                                  <div className="w-full sm:max-w-[300px]">
                                  <CustomButton
                                       label="Upload Image"
                                       className={''}
                                       callback={()=>{handleUploadImageModelOpen(event)}}
                                     />
                                  </div>
                                  <CustomModal handleClose={handleUploadImageModelClose} open={openUploadImageModel} modelData={modelData} />
                                  {/* <div className="w-full sm:max-w-[300px] flex justify-center items-center">
                                    <Button
                                      aria-describedby={id}
                                      onClick={handleClick}
                                      className="text-black capitalize"
                                    >
                                      <div className="flex gap-1 sm:gap-2 sm:bg-[#F2F0EB] rounded-[25px] py-[8px] px-[5px] sm:px-[20px] justify-center items-center cursor-pointer">
                                        <PiCalendarDots className="text-[17px] sm:text-[18px]" />
                                        <div className="font-normal leading-[19px] hidden sm:block">
                                          Schedule
                                        </div>
                                      </div>
                                    </Button>
                                    <Popover
                                      id={id}
                                      open={open}
                                      anchorEl={anchorEl}
                                      onClose={handleClose}
                                      anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                      }}
                                      className="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;"
                                      sx={{
                                        ".css-uywun8-MuiPaper-root-MuiPopover-paper":
                                          {
                                            boxShadow: "initial",
                                          },
                                      }}
                                    >
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <div className="bg-[#EEF2EB] pb-4">
                                          <DateCalendar
                                            sx={{
                                              ".css-23p0if-MuiButtonBase-root-MuiPickersDay-root.Mui-selected":
                                                {
                                                  backgroundColor: "#3BAD49",
                                                },
                                              ".css-1wy8uaa-MuiButtonBase-root-MuiPickersDay-root.Mui-selected":
                                                {
                                                  backgroundColor: "#3BAD49",
                                                },
                                              ".css-uywun8-MuiPaper-root-MuiPopover-paper":
                                                {
                                                  backgroundColor: "#EEF2EB",
                                                },
                                              ".css-1wy8uaa-MuiButtonBase-root-MuiPickersDay-root:hover":
                                                {
                                                  backgroundColor: "#d7f1db",
                                                },
                                            }}
                                          />
                                          <button
                                            type="button"
                                            className="flex bg-[#F1B932] font-normal leading-[19px] mx-auto py-[7px] px-[20px] rounded-[25px]"
                                          >
                                            Schedule
                                          </button>
                                        </div>
                                      </LocalizationProvider>
                                    </Popover>
                                  </div> */}
                                </div>
                              ))}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  ))}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )})}
        </div>
      </div>

      {/* Completed events */}
      <div className="flex flex-col w-full gap-4 sm:gap-6 px-[10px] sm:px-[80px] mb-[100px]">
        <div className="font-bold text-[22px] sm:text-[32px] leading-[26px] sm:leading-[39px]">
          Completed events
        </div>
        <div className="flex flex-col w-full">
          {groupEvents?.completed?.map((cur: any, yearIndex: number) => (
            <Accordion
              key={cur.year}
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
                            <div className="flex flex-col w-full text-[14px] sm:text-[16px] px-2 sm:px-0">
                              {month?.events?.map((event: any, eventIndex: any) => (
                                <div
                                  key={eventIndex}
                                  className="flex w-full gap-3 sm:justify-between border-t-[1px] border-[#666666] py-2 items-center"
                                >
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                    {formatDate(event?.startDate, month?.month)}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                    {event?.eventName}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center">
                                    {event?.region}
                                  </div>
                                  <div className="w-full sm:max-w-[300px] font-normal leading-[19px] text-center"></div>
                                </div>
                              ))}
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
    </div>
  );
}
