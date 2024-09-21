"use client";
import Image from "next/image";
import InputField from "./ui/CustomInputFild";
import CustomDate from "./ui/CustomDate";
import CustomButton from "./ui/CustomButton";
import { useEffect, useState } from "react";
import {
  createCheckoutSession,
  updateUserInfo,
  uploadFile,
} from "../_actions/actions";
import { toast } from "react-toastify";
import { fireStorage } from "@/utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

interface TrackPageProps {
  userInfo: {
    _id: string;
    name: string;
    email: string;
    cohort: string;
    datePlanted: string;
    images: { day: number; image: string }[];
    location: string;
  };
  userId:string;
}

export default function TrackPage(props: TrackPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    cohort: "",
    datePlanted: "",
    images: [],
  });
  const [paymentData, setPaymentData] = useState({
    name: "",
    email: "",
    amount: 0,
  });
  const [errors, setErrors] = useState({
    name: "",
    cohort: "",
    datePlanted: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({
    name: "",
    email: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [imageFiles, setImageFiles] = useState<{ [key: number]: File }>({});

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", cohort: "", datePlanted: "", images: "" };

    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length > 25) {
      newErrors.name = "Name must be 15 characters or less";
      isValid = false;
    }

    if (!formData.cohort) {
      newErrors.cohort = "Cohort is required";
      isValid = false;
    } else if (formData.cohort.length > 25) {
      newErrors.cohort = "Cohort must be 15 characters or less";
      isValid = false;
    }

    if (!formData.datePlanted) {
      newErrors.datePlanted = "Date Planted is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const paymentValidateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", amount: "" };

    if (!paymentData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (paymentData.name.length > 25) {
      newErrors.name = "Name must be 25 characters or less";
      isValid = false;
    }

    if (!paymentData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (paymentData.email.length > 25) {
      newErrors.email = "Email must be 25 characters or less";
      isValid = false;
    }

    if (!paymentData.amount) {
      newErrors.amount = "Amount is required";
      isValid = false;
    }

    setPaymentErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    day: number
  ) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setImageFiles((prev) => ({
        ...prev,
        [day]: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData: any) => ({
          ...prevData,
          images: prevData.images.map((img: any) =>
            img.day === day ? { ...img, image: reader.result as string } : img
          ),
        }));
      };
      reader.readAsDataURL(file);
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    const updatedImages = await Promise.all(
      formData.images.map(async (img: any) => {
        if (imageFiles[img.day]) {
          const { url } = await uploadFile("planted-tree", imageFiles[img.day]);
          return { ...img, image: url };
        }
        return img;
      })
    );
    
    const data = {
      id: props.userId,
      userData: {
        ...formData,
        images: updatedImages,
      },
    };

    const res = await updateUserInfo(data);
    
    if (res) {
      toast(res?.data?.message);
    }
    setIsLoading(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "name" && value.length > 35) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name must be 35 characters or less",
      }));
      return;
    }

    if (name === "cohort" && value.length > 35) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cohort: "Cohort must be 35 characters or less",
      }));
      return;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePayment = (e: any) => {
    const { name, value } = e.target;
    if (name === "name" && value.length > 35) {
      setPaymentErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name must be 35 characters or less",
      }));
      return;
    }

    if (name === "email" && value.length > 35) {
      setPaymentErrors((prevErrors) => ({
        ...prevErrors,
        email: "email must be 35 characters or less",
      }));
      return;
    }
    setPaymentErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    const parsedValue = name === "amount" ? parseFloat(value) || 0 : value;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleDonate = async () => {
    if (!paymentValidateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await createCheckoutSession({
        name: paymentData.name,
        email: paymentData.email,
        amount: paymentData.amount,
      });
      if (response?.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (props?.userInfo) {
      const newImageArray: any = [1, 60, 90].map((day: any, index: number) =>
        props.userInfo.images.find((e: any, i: number) => e.day === day)
          ? props.userInfo?.images[index]
          : { day, image: null }
      );
      setFormData({
        name: props?.userInfo?.name || "",
        cohort: props?.userInfo?.cohort || "",
        datePlanted: props?.userInfo?.datePlanted || "",
        images: newImageArray,
      });
    }
  }, [props.userInfo]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="flex flex-col w-full items-center px-6 py-[40px] gap-10 lg:gap-14">
        <p className="text-[18px] sm:text-[24px] lg:text-[25px] font-semibold text-center lg:pb-7">
          Track My{" "}
          <span className="py-1 px-3 font-medium text-white bg-[#306E1D] rounded-full">
            Tree
          </span>
        </p>
        <div className="flex flex-col w-full lg:flex-row gap-5 lg:gap-11 justify-center">
          <div className="flex flex-col w-full lg:max-w-[250px] lg:min-w-[208px]">
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
          <div className="flex flex-col w-full lg:max-w-[250px] lg:min-w-[208px]">
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
          <div className="flex flex-col w-full lg:max-w-[250px] lg:min-w-[208px]">
            <CustomDate
              label="Date Planted"
              value={formData.datePlanted}
              onChange={handleDateChange}
            />
            {errors.datePlanted && (
              <p className="text-red-500 text-sm mt-1">{errors.datePlanted}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full lg:flex-row gap-5 lg:gap-11 justify-center">
          {formData?.images?.map((imageObj: any) => {
            return (
              <div
                key={imageObj.day}
                className="flex flex-col w-full lg:max-w-[250px] lg:min-w-[208px] gap-2"
              >
                <label className="text-[16px] text-[#404040] font-medium">
                  Day {imageObj.day}
                </label>
                {!imageObj?.image && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`plant-image-${imageObj.day}`}
                      name="image"
                      onChange={(e: any) => {
                        handleImageChange(e, imageObj.day);
                      }}
                    />
                    <label
                      htmlFor={`plant-image-${imageObj.day}`}
                      className="flex gap-[10px] w-full border-dashed border items-center border-[#777777] rounded-[10px] p-[15px]"
                    >
                      <div className="flex flex-col gap-[10px] items-center w-full">
                        <p className="text-nowrap">Attach photo</p>
                        <CustomButton
                          label="Choose File"
                          className="flex px-2 w-max md:w-full h-max !bg-white !text-[#306E1D] border !border-[#306E1D] hover:!bg-white -z-10"
                        />
                      </div>
                    </label>
                  </>
                )}
                {imageObj.image && (
                  <Image
                    src={imageObj?.image}
                    alt={`Day ${imageObj?.day}`}
                    width={100}
                    height={100}
                    className="w-full"
                    unoptimized
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end w-full max-w-[840px]">
          <CustomButton
            label="Save"
            className="flex !px-[25px] w-full sm:!w-[304px] md:!w-full lg:!w-[304px] h-max !text-white border !border-[#306E1D]"
            callback={handleSave}
            interactingAPI={isLoading}
          />
        </div>
      </div>
      <div className="flex flex-col w-full shadow-xl shrink-l lg:max-w-[393px] py-10 px-6 gap-4">
        <div>
          <p className="text-[18px] sm:text-[24px] font-normal text-center px-16">
            <span className="text-[#FF65DD]">Donate</span> to grow
          </p>
          <p className="text-[18px] sm:text-[24px] font-normal text-center px-16">
            LEAD Me2We forest
          </p>
        </div>
        <div>
          <InputField
            name="name"
            placeholder="Enter your name"
            type="text"
            onChange={handlePayment}
            value={paymentData.name}
            className="text-[16px] mt-[8px]"
            label={"Name"}
            bgColor="#F4F4F4"
          />
          {paymentErrors.name && (
            <p className="text-red-500 text-sm mt-1">{paymentErrors.name}</p>
          )}
        </div>
        <div>
          <InputField
            name="email"
            placeholder="Enter your email"
            type="email"
            onChange={handlePayment}
            value={paymentData.email}
            className="text-[16px] mt-[8px]"
            label={"Email"}
            bgColor="#F4F4F4"
          />
          {paymentErrors.email && (
            <p className="text-red-500 text-sm mt-1">{paymentErrors.email}</p>
          )}
        </div>
        <div>
          <InputField
            name="amount"
            placeholder="$"
            type="number"
            onChange={handlePayment}
            value={paymentData.amount.toString()}
            className="text-[16px] mt-[8px]"
            label={"Enter Amount"}
            bgColor="#F4F4F4"
            amount
          />
          {paymentErrors.amount && (
            <p className="text-red-500 text-sm mt-1">{paymentErrors.amount}</p>
          )}
        </div>
        <CustomButton
          label="Donate Now"
          callback={handleDonate}
          className="flex px-2 w-full !h-[40px] !bg-[#FF65DD] !text-white my-1"
          interactingAPI={loading}
        />
      </div>
    </div>
  );
}
