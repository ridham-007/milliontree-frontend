"use client";

import { useEffect, useState } from "react";
import { addUpdateEvent, deleteEvent, paginatedEvents } from "@/app/_actions/actions";
import { toast } from "react-toastify";
import CustomButton from "../ui/CustomButton";
import InputField from "../ui/CustomInputFild";
import CustomDate from "../ui/CustomDate";
import DataTable from "../ui/DataTable";
import CustomModal from "../ui/CustomModel";
import { RiCloseCircleLine } from "react-icons/ri";
import PlacesAutocomplete from "../ui/PlacesAutoComplete";
import { IoMdClose } from "react-icons/io";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireStorage } from "@/utils/firebase";
import { v4 as uuidv4 } from 'uuid';
import UpdateEvent from "./updateEvent";

interface EventProps {
    authId?: string;
}
interface regionImagesProps {
    eventName: string;
    region: string;
    images: string[];
    startDate: string,
    latitude: number,
    placeId: string,
    longitude: number,
}

export default function Event({ authId }: EventProps) {
    const initialEventData = {
        eventName: '',
        region: '',
        startDate: '',
        latitude: 0,
        longitude: 0,
        placeId: '',
        images: [],
    };

    const [openModel, setOpenModel] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [imageFiles, setImageFiles] = useState<any>([]);
    const [eventData, setEventData] = useState<regionImagesProps>(initialEventData);
    const [showEditEvent, setShowEditEvent] = useState(false);
    const [editEventData, setEditEventData] = useState<any>({});  //when click on edit set data 
    const [eventsData, setEventsData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const handleModelOpen = () => setOpenModel(true);
    const [page, setPage] = useState(0);
    let limit = 5;
    
    const handlePagination = (curPage: number) => {
        setPage(curPage);
    };

    const events = async () => {
        setLoading(true)
        let updatedEventData: any = {
            page: page + 1,
            limit: limit,
        }
        try {
            const response: any = await paginatedEvents(updatedEventData);
            if (response?.success) {
                setEventsData(response?.data);
                setLoading(false)
            } else {
                console.error("Failed to fetch events:", response.message);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleActionMenu = async (type: any, item: any) => {
        if (type === "edit") {
            setEditEventData(item)
            setShowEditEvent(true)
        } else if (type === "delete") {
            const response = await deleteEvent(item?._id);
            if (response) {
                await events();
            }
        }
    };

    const formatDate: any = (dateString: string) => {
        const [datePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-');
    
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthName = months[parseInt(month) - 1];
        return `${monthName} ${parseInt(day)}, ${year}`;
      }

    const tableConfig = {
        notFoundData: 'No events found',
        actionPresent: true,
        actionList: ["edit", "delete"],
        handlePagination: handlePagination,
        onActionClick: handleActionMenu,
        columns: [
            {
                field: "eventName",
                headerName: "Event Name",
            },
            {
                field: "region",
                headerName: "Event Location",
            },
            {
                field: "startDate",
                headerName: "Event Date",
                customRender: (row: any) => {
                    const formattedDate = formatDate(row?.startDate);
                    return <div>{formattedDate}</div>;
                  },
            },
        ],
        rows: eventsData?.events || [],
        pagination: {
            totalResults: eventsData?.total,
            totalPages: Math.ceil((eventsData?.total || 0) / limit),
            currentPage: page,
            rowPerPage: limit
        },
    };

    const handleModelClose = () => {
        setOpenModel(false);
        setEventData(initialEventData);
        setErrors({});
    };

    const validateEventDataForm = () => {
        let isValid = true;
        const newErrors = {
            eventName: "",
            region: "",
            startDate: "",
        };

        if (!eventData.eventName) {
            newErrors.eventName = "Name is required";
            isValid = false;
        } else if (eventData.eventName.length > 35) {
            newErrors.eventName = "Event name must be 35 characters or less";
            isValid = false;
        }

        if (!eventData.region) {
            newErrors.region = "Region is required";
            isValid = false;
        }

        if (!eventData.startDate) {
            newErrors.startDate = "Event Date is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleEventDataChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        data?: {
            location: string;
            latitude: number;
            longitude: number;
            placeId: string;
        }
    ) => {
        if (event && event.target) {
            const { name, value, type, files } = event.target;
            if (type === 'file' && files) {
                const fileArray = Array.from(files);
                const imageUrls = fileArray.map(file => URL.createObjectURL(file));

                setEventData((prevData) => ({
                    ...prevData,
                    images: [...prevData.images, ...imageUrls],
                }));
            } else {
                setEventData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
            if (files && files[0]) {
                const file = files[0];
                setImageFiles((prev: any) => ([
                    ...prev,
                    file,
                ]));
            }
            if (name === "eventName") {
                if (!value) {
                    setErrors((prevErrors: any) => ({
                        ...prevErrors,
                        eventName: "Event name is required",
                    }));
                } else if (value.length > 35) {
                    setErrors((prevErrors: any) => ({
                        ...prevErrors,
                        eventName: "Event name must be 35 characters or less",
                    }));
                } else {
                    setErrors((prevErrors: any) => ({
                        ...prevErrors,
                        eventName: "",
                    }));
                }
            }
        } else if (data) {
            setEventData((prevFormData) => ({
                ...prevFormData,
                region: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
                placeId: data.placeId
            }));

            if (!data.location) {
                setErrors((prevErrors: any) => ({
                    ...prevErrors,
                    region: "Region is required",
                }));
            } else {
                setErrors((prevErrors: any) => ({
                    ...prevErrors,
                    region: "",
                }));
            }
        }
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

    const removeImage = (indexToRemove: number) => {
        setEventData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, index) => index !== indexToRemove),
        }));
        setImageFiles((prevFiles: any) => prevFiles.filter((_cur: any, index: number) => index !== indexToRemove));
    };

    const handleSave = async () => {
        if (!validateEventDataForm()) {
            return;
        }
        setLoading(true);

        let finalUserDetails = { ...eventData };
        if (imageFiles && imageFiles?.length > 0) {
            try {
                const uploadedImages = await Promise.all(
                    imageFiles?.map(async (image: any) => {
                        const { url } = await uploadFile("planted-tree", image);
                        return url;
                    })
                );
                finalUserDetails = { ...eventData, images: uploadedImages }; 
            } catch (error) {
                console.error("Error uploading image file(s):", error);
                return;
            }
        }
        try {
            const response = await addUpdateEvent(finalUserDetails);
            if (response?.success) {
                toast(response?.message);
                setOpenModel(false);
                events();
            } else {
                toast.error(response?.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }

        setEventData(initialEventData);
        setLoading(false);
    };

    const handleDateChange = (newValue: any) => {
        if (!newValue) {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                startDate: "Date Planted is required",
            }));
        } else {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                startDate: "",
            }));
        }
        setEventData((prevData) => ({
            ...prevData,
            startDate: newValue,
        }));
    };


    const modelData = (
      <>
        <div className="flex justify-between px-8 py-4 border-b items-center">
          <p className="text-[22px] font-semibold">Add Event</p>
          <RiCloseCircleLine
            size={24}
            onClick={handleModelClose}
            className="cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-5 w-full px-8 py-4">
          <div>
            <InputField
              name="eventName"
              placeholder="Enter your name"
              type="text"
              onChange={handleEventDataChange}
              value={eventData.eventName}
              className="text-[16px] mt-[8px] rounded-[8px] border border-[#f4f4f4]"
              label={"Event name"}
              bgColor="#F4F4F4"
            />
            {errors.eventName && (
              <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
            )}
          </div>
          <div>
            <PlacesAutocomplete
              name="region"
              className="mt-[8px] w-full rounded-[8px] border border-[#f4f4f4] z-[99999]"
              placeholder="Region of the event?"
              label="Region"
              onChange={handleEventDataChange}
              value={eventData.region}
            />
            {errors.region && (
              <p className="text-red-500 text-sm mt-1">{errors.region}</p>
            )}
          </div>
          <div>
            <label className="font-medium">Event Date</label>
            <CustomDate
              value={eventData.startDate}
              onChange={handleDateChange}
              className="border border-[#999999] mt-[9px] sm:w-[298px] !h-[48px] "
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              multiple 
              className="hidden w-full sm:w-max"
              id="plant-image"
              name="images"
              onChange={handleEventDataChange}
            />
            <label
              htmlFor="plant-image"
              className="flex sm:w-max gap-[10px] border-dashed border items-center border-[#777777] rounded-[10px] p-[15px]"
            >
              <p className="text-nowrap">Attach photo</p>
              <CustomButton
                label="Choose File"
                className="flex px-2 w-full sm:w-max h-max !bg-white !text-[#306E1D] border !border-[#306E1D] hover:!bg-white -z-10"
              />
            </label>
          </div>
          <div className="flex flex-wrap max-h-[150px] overflow-y-auto gap-2 custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {eventData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center bg-[#f2f0eb] p-2"
                >
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-gray-500 text-white rounded-full p-1"
                  >
                    <IoMdClose size={20} />
                  </button>
                </div>
              ))}
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
        events()
    }, [page])

    return (
        <>
            {showEditEvent ? (
                <UpdateEvent data={editEventData} setShowEditEvent={setShowEditEvent} refetchData={events} />
            ) : (<div className="flex flex-col w-full h-full bg-white items-center px-3 sm:px-5 gap-5 py:py-5 sm:py-10">
                <div className="flex justify-end w-full">
                    <CustomButton label={'Create Event'} callback={handleModelOpen} />
                    <CustomModal handleClose={handleModelClose} open={openModel} modelData={modelData} />
                </div>
                <DataTable tableConfig={tableConfig} isLoading={loading} fixRow={true} />
            </div>)}
        </>
    );
}
