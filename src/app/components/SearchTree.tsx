"use client";
import dynamic from "next/dynamic";

import InputField from "./ui/CustomInputFild";
import CustomButton from "./ui/CustomButton";
import { useState } from "react";
import { createEvent, deleteUserById, getUserByEmail } from "../_actions/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomModal from "./ui/CustomModel";
import PlacesAutocomplete from "./ui/PlacesAutoComplete";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { fireStorage } from "@/utils/firebase";
import { v4 as uuidv4 } from 'uuid';
import { RiCloseCircleLine, RiDeleteBinLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

interface SearchTreeProps {}
const DataTable = dynamic(() => import("@/app/components/ui/DataTable"), {
  ssr: false,
});
interface regionImagesProps {
  eventName: string;
  region: string;
  images: string[];
}

export default function SearchTree(props: SearchTreeProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [userData, setUserData] = useState<any>([]);
  const [openModel, setOpenModel] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [imageFiles, setImageFiles] = useState<any>([]);
  
  const initialEventData ={
    eventName:'',
    region: '',
    images: [],
  };
  const [eventData, setEventData] = useState<regionImagesProps>(initialEventData);

  const handleModelOpen = () => setOpenModel(true);

  const handleModelClose = () => { 
    setOpenModel(false);
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const validateEventDataForm = () => {
    let isValid = true;
    const newErrors = {
      eventName: "",
      region: "",
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

    setErrors(newErrors);
    return isValid;
  };
  
  const handleSearch = async () => {
    setIsLoading(true)
    setUserData([])
    try {
      if (!email) {
        toast("Email is required to search for a user.");
        setIsLoading(false)
        return;
      }
      const response = await getUserByEmail(email);
      if (response?.data?.success) {
        const user = response?.data?.user;
        setUserData(user);
      } else {
        toast(response?.data?.message);
        setUserData([]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setIsLoading(false)

  };

  const handleClear = () => {
    setUserData([])  
    setEmail('')
  };

  const deleteUser = async (userId: string) => {
    const response = await deleteUserById(userId);
    if(response?.data?.success){
      toast(response?.data?.message)  
      const data = await getUserByEmail(email);
      const user = data?.data?.user;
      setUserData(user)

    }
  };

  const handleEdit = async (userId: string) => {
    if(userId){
    router.push(`/track/${userId}`);
  }
  };

  const handleActionMenu = (value: string, user: any) => {
    if (value === "edit") {
      handleEdit(user?._id);
    }
    if (value === "delete") {
      deleteUser(user?._id);
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

  const handleEventDataChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    data?: {
      location: string;
    }
  ) => {
    if (event && event.target) {
      const { name, value, type, files } = event.target;
      if (type === 'file' && files) {
        const fileArray = Array.from(files); // Convert FileList to array
  
        const fileNames = fileArray.map((file) => file.name); // Store file names as strings
  
        setEventData((prevData) => ({
          ...prevData,
          images: [...prevData.images, ...fileNames],
        }));
      } else {
        setEventData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
      if (files && files[0]) {
        const file = files[0];
        setImageFiles((prev:any) => ([
          ...prev,
           file,
        ]));
      }
    if (name === "eventName") {
      if (!value) {
        setErrors((prevErrors:any) => ({
          ...prevErrors,
          eventName: "Event name is required",
        }));
      } else if (value.length > 35) {
        setErrors((prevErrors:any) => ({
          ...prevErrors,
          eventName: "Event name must be 35 characters or less",
        }));
      } else {
        setErrors((prevErrors:any) => ({
          ...prevErrors,
          eventName: "",
        }));
      }
    }
  } else if (data) {
    setEventData((prevFormData) => ({
      ...prevFormData,
      region: data.location,
    }));

    if (!data.location) {
      setErrors((prevErrors:any) => ({
        ...prevErrors,
        region: "Region is required",
      }));
    } else {
      setErrors((prevErrors:any) => ({
        ...prevErrors,
        region: "",
      }));
    }
  }
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
          imageFiles?.map(async (image:any) => {
            const { url } = await uploadFile("planted-tree", image);
            return url; // Return the uploaded URL
          })
        );
        finalUserDetails = { ...eventData, images: uploadedImages }; // Set the array of image URLs
      } catch (error) {
        console.error("Error uploading image file(s):", error);
        return;
      }
    }
    try {
      const {response} = await createEvent(finalUserDetails);
      if (response?.success) {
        toast(response?.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  
    setEventData(initialEventData);
    setLoading(false);
  };
  
  
  // const removeImage = (imageToRemove: string) => {
  //   setEventData((prevData) => ({
  //     ...prevData,
  //     images: prevData.images.filter((img) => img !== imageToRemove),
  //   }));
   
  // };

  const removeImage = (indexToRemove: number) => {
    setEventData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
    setImageFiles((prevFiles:any) => prevFiles.filter((_cur:any, index:number) => index !== indexToRemove));
  };
  
  
  const modelData = (
    <>
    <div className="flex justify-between px-8 py-4 border-b items-center">
      <p className="text-[22px] font-semibold">Add Event</p>
      <RiCloseCircleLine size={24} onClick={handleModelClose} className="cursor-pointer"/>
    </div>
    <div className="flex flex-col gap-5 w-full px-8 py-4">
      <div>
      <InputField
        name="eventName"
        placeholder="Enter your name"
        type="text"
        onChange={handleEventDataChange}
        value={eventData.eventName}
        className="text-[16px] mt-[8px]"
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
          className="flex sm:w-max gap-[10px] border-dashed border items-center border-[#777777] rounded-[10px] p-[15px]"
        >
          <p className="text-nowrap">Attach photo</p>
          <CustomButton
            label="Choose File"
            className="flex px-2 w-full sm:w-max h-max !bg-white !text-[#306E1D] border !border-[#306E1D] hover:!bg-white -z-10"
          />
        </label>
        </div>
        <div className="flex flex-wrap max-h-[100px] overflow-y-auto gap-2">
        {eventData.images.map((image, index) => (
          <div
          key={index}
          className="flex gap-2 w-max h-max items-center bg-[#d0cfcf] rounded-full p-2 pl-3"
        >
          <p>{image}</p>
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="ml-2 text-white rounded-full p-1"
          >
            <IoMdClose size={20} color="gray"/>
          </button>
        </div>
        ))}
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
  
  const tableConfig = {
    notFoundData: " No user found",
    actionPresent: true,
    actionList: ["edit", "delete"],
    // handlePagination: handlePagination,
    onActionClick: handleActionMenu,
    columns: [
      {
        field: "name",
        headerName: "Name",
      },
      {
        field: "email",
        headerName: "Email",
      },
      {
        field: "cohort",
        headerName: "Cohort",
      },
      {
        field: "datePlanted",
        headerName: "Date Planted",
        customRender: (cur: any) => {
          const date = new Date(cur.datePlanted);
          const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(date);
          return (
            <div>
              {formattedDate}
            </div>
          );
        },
      }
    ],
    rows: userData || [],
    pagination: {
      totalResults: 10,
      totalPages: 10,
      currentPage: 1,
    },
  };

  return (
    <div className="flex flex-col w-full h-full px-5 py-10 gap-5">
      <div className="flex flex-col sm:flex-row w-full max-w-[840px] items-end gap-2">
        <div className="w-full">
          <label className="text-[16px] text-[#404040] font-medium pb-3">
            Search
          </label>
          <InputField
            name="email"
            placeholder="Search by email"
            type="email"
            onChange={handleChange}
            value={email}
            className="text-[16px] mt-[8px]"
            bgColor="#F4F4F4"
          />
        </div>
        <div className="flex gap-3">
        <CustomButton
          label="Search"
          className="flex px-2 !w-[83px] !h-[48px] !bg-[#306E1D] !text-white border !border-[#306E1D]"
          callback={handleSearch}
          interactingAPI={isLoading}
        />
         <CustomButton
          label="Clear"
          className="flex px-2 !w-[83px] !h-[48px] !bg-white !text-[#306E1D] border !border-[#306E1D]"
          callback={handleClear}
        />
        <CustomButton
          label="Add Event"
          className="flex px-2 !w-max !h-[48px] !bg-white !text-[#306E1D] border !border-[#306E1D]"
          callback={handleModelOpen}
        />
        <CustomModal handleClose={handleModelClose} open={openModel} modelData={modelData}/>
        </div>
      </div>
      <div className="w-full max-w-[840px]">
      <DataTable tableConfig={tableConfig} />
      </div>
    </div>
  );
}
