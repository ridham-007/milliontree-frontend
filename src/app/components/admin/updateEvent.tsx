"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomButton from "../ui/CustomButton";
import InputField from "../ui/CustomInputFild";
import CustomDate from "../ui/CustomDate";
import { addupdateEvent } from "@/app/_actions/actions";
import PlacesAutocomplete from "../ui/PlacesAutoComplete";

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
    console.log(event, "ccc")
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const response: any = await addupdateEvent({
                _id: data._id,
                eventName: event.eventName,
                region: event.region,
                latitude: event.latitude,
                longitude: event.longitude,
                placeId: event.placeId,
                startDate: event.startDate,
            });
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
            const { name, value } = event.target;

            setEvent((prevData) => ({
                ...prevData,
                [name]: value,
            }));
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
                <div className="flex justify-end gap-4 mt-4">
                    <CustomButton label="Back" callback={() => setShowEditEvent(false)} className="!text-black !bg-transparent border" />
                    <CustomButton label={'Submit'} callback={handleSubmit} interactingAPI={submitLoading || false} className="!w-[90px]" />
                </div>
            </div>
        </div>
    );
}


