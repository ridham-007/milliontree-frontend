"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomButton from "../ui/CustomButton";
import InputField from "../ui/CustomInputFild";
import CustomDate from "../ui/CustomDate";
import { addUpdateEvent } from "@/app/_actions/actions";
import PlacesAutocomplete from "../ui/PlacesAutoComplete";
import { IoMdClose } from "react-icons/io";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireStorage } from "@/utils/firebase";
import { v4 as uuidv4 } from 'uuid';
interface updateEventProps {
    data?: any;
    setShowEditEvent?: any;
    refetchData?: any;
}
interface EventData {
    eventName: string;
    region: string;
    images: string[];
    startDate: string,
    placeId: string,
    latitude: number,
    longitude: number,
}

export default function UpdateEvent({ data, setShowEditEvent, refetchData }: updateEventProps) {
    const initialEventData = {
        eventName: '',
        region: '',
        startDate: '',
        latitude: 0,
        longitude: 0,
        placeId: '',
        images: [],
    };
    const [event, setEvent] = useState<EventData>(initialEventData);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<any>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);

        let finalUserDetails = { ...event };
        const validImages = event.images.filter(image => !image.startsWith("blob:"));
        if (imageFiles && imageFiles?.length > 0) {
            try {
                const uploadedImages = await Promise.all(
                    imageFiles?.map(async (image: any) => {
                        const { url } = await uploadFile("planted-tree", image);
                        return url;
                    })
                );
                finalUserDetails = { ...event, images: [...validImages, ...uploadedImages], }; 
            } catch (error) {
                console.error("Error uploading image file(s):", error);
                setSubmitLoading(false);
                return;
            }
        }
        try {
            const response: any = await addUpdateEvent(finalUserDetails);
            if (response?.success) {
                toast(response?.message);
                setEvent(initialEventData);
                setSubmitLoading(false);
                setShowEditEvent(false)
                await refetchData()
            }
        } catch (error) {
            toast.error("Failed to submit contact details. Please try again.");
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
        setEvent((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, index) => index !== indexToRemove),
        }));
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

                setEvent((prevData) => ({
                    ...prevData,
                    images: [...prevData.images, ...imageUrls],
                }));
            }else {
                setEvent((prevData) => ({
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

        } else if (data) {
            setEvent((prevFormData) => ({
                ...prevFormData,
                region: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
                placeId: data.placeId
            }));

        }
    };

    useEffect(() => {
        if (data) {
            setEvent(data);
        }
    }, [data])

    return (
      <div className="flex flex-col w-full h-full bg-white items-center px-3 sm:px-5">
        <div className="flex flex-col w-full max-w-[1050px] h-full gap-5 py-10">
          <InputField
            name="eventName"
            placeholder="Enter your name"
            type="text"
            onChange={handleEventDataChange}
            value={event.eventName}
            className="text-[16px] mt-[8px] rounded-[8px] border border-[#f4f4f4]"
            label={"Event name"}
            bgColor="#F4F4F4"
          />
          <div className="flex flex-col md:flex-row w-full gap-5">
            <PlacesAutocomplete
              name="region"
              className="mt-[8px] w-full rounded-[8px] border border-[#f4f4f4]"
              placeholder="Region of the event?"
              label="Region"
              onChange={handleEventDataChange}
              value={event.region}
            />
          </div>
          <div className="flex flex-col md:flex-row w-full gap-5">
            <CustomDate
              label="Event Date"
              value={event.startDate}
              minDate={true}
              className="h-[48px] mt-2 border border-[#cccccc]"
              onChange={(newValue: any) => {
                setEvent((prevData) => ({
                  ...prevData,
                  startDate: newValue,
                }));
              }}
            />
          </div>
          <label className="font-medium">Images</label>
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
              className="flex sm:w-max gap-[10px] border-dashed border items-center border-[#777777] rounded-[10px] p-[8px]"
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
              {event.images.map((image, index) => (
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
          <div className="flex justify-end gap-4 mt-4">
            <CustomButton
              label="Back"
              callback={() => setShowEditEvent(false)}
              className="!text-black !bg-transparent border"
            />
            <CustomButton
              label={"Submit"}
              callback={handleSubmit}
              interactingAPI={submitLoading || false}
              className="!w-[90px]"
            />
          </div>
        </div>
      </div>
    );
}


