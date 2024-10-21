"use client";
import Image from "next/image";
import InputField from "./ui/CustomInputFild";
import CustomDate from "./ui/CustomDate";
import CustomButton from "./ui/CustomButton";
import { useEffect, useState } from "react";
import {
  getTreesByUserById,
  updateTreeInfo,
  uploadFile,
} from "../_actions/actions";
import { toast } from "react-toastify";
import { fireStorage } from "@/utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import CustomSelection from "./ui/CustomSelect";
import { IoMdClose } from "react-icons/io";
const Cookies = require("js-cookie");

export default function TrackPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    _id: "",
    treeName: "",
    cohort: "",
    datePlanted: "",
    location: "",
    userId: "",
    images: [{ day: "", image: "" }],
  });
  const [treeData, setTreeData] = useState([]);
  const [errors, setErrors] = useState({
    treeName: "",
    cohort: "",
    datePlanted: "",
  });
  const [isLoading, setIsLoading] = useState<any>(false);
  const [isRefresh, setIsRefresh] = useState<any>(false);
  const [imageFiles, setImageFiles] = useState<{ [key: number]: File }>({});
  const [treeNameData, setTreeNameData] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectTree, setSelectTree] = useState<{
    value: string;
    label: string;
  }>();

  const transformedData = (
    treeData: any | undefined
  ): { value: string; label: string }[] => {
    if (!treeData || treeData.length === 0) return [];
    return treeData.map((tree: any) => ({
      value: tree._id,
      label: tree.treeName,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { treeName: "", cohort: "", datePlanted: "", images: "" };

    if (!formData.treeName) {
      newErrors.treeName = "Name is required";
      isValid = false;
    } else if (formData.treeName.length > 25) {
      newErrors.treeName = "Name must be 15 characters or less";
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
        setFormData((prevData: any) => {
          const existingImageIndex = prevData.images.findIndex(
            (img: any) => img.day === day
          );

          if (existingImageIndex !== -1) {
            const updatedImages = [...prevData.images];
            updatedImages[existingImageIndex] = {
              ...updatedImages[existingImageIndex],
              image: reader.result as string,
            };
            return {
              ...prevData,
              images: updatedImages,
            };
          } else {
            return {
              ...prevData,
              images: [
                ...prevData.images,
                { day, image: reader.result as string },
              ],
            };
          }
        });
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

  const handleDeleteImage = (day: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      images: prevData.images.filter((img: any) => img.day !== day),
    }));
    setImageFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      delete updatedFiles[day];
      return updatedFiles;
    });
  };

  const handleSave = async () => {
    if (!formData?._id) {
      setIsLoading(false);
      return toast.info("Select tree to proceed");
    }

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
      ...formData,
      images: updatedImages,
    };

    const res = await updateTreeInfo(JSON.stringify(data));

    if (res?.success) {
      toast(res?.message);
      setIsRefresh(true);
    }
    setIsLoading(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "treeName" && value.length > 35) {
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

  const getTrees = async () => {
    // const user = JSON.parse(Cookies.get("user"));
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    const userId = user?.userId;

    if (!userId) {
      router.push("/login");
    }

    const userInfo = await getTreesByUserById(userId);

    if (userInfo?.data?.success) {
      setTreeData(userInfo?.data?.tree);
      setTreeNameData(transformedData(userInfo?.data?.tree));
    }
  };

  useEffect(() => {
    getTrees();
  }, [isRefresh, selectTree]);

  const selectedTreeDetails = treeData.find(
    (tree: any) => tree._id === selectTree?.value
  );

  useEffect(() => {
    if (selectedTreeDetails) {
      setFormData(selectedTreeDetails);
    }
  }, [selectedTreeDetails]);

  return (
    <div className="flex flex-col items-center w-full px-2 pb-[50px] sm:pb-[100px] ">
      <div className="flex flex-col w-full max-w-[1280px]">
        <div className="w-full relative z-30">
          <Image
            src={"/images/TrackMyTree-bg.webp"}
            width={350}
            height={350}
            alt=""
            unoptimized
            className="w-full h-[280px] sm:h-[350px] rounded-[40px]"
          />
          <p className="w-full top-[100px] sm:top-[150px] text-[34px] sm:text-[44px] font-bold absolute text-white text-center leading-[41px] tracking-[12px]">
            TRACK MY TREE
          </p>
        </div>
        <div className="flex w-full justify-end my-4">
          <div className="w-full max-w-[380px]">
          <CustomSelection
            className="w-full rounded-none "
            placeholder={"Please select"}
            label="Select event"
            data={treeNameData}
            value={selectTree}
            onChange={(value: any) => setSelectTree(value)}
          />
          </div>
        </div>

        <div className="flex flex-col items-end justify-between sm:flex-row w-full gap-[15px] md:gap-[55px] py-2 sm:py-8">
          <div className="flex flex-col w-full lg:max-w-[380px]">
            <InputField
              name="treeName"
              placeholder="Enter your tree name"
              type="text"
              onChange={handleChange}
              value={formData.treeName}
              className="text-[16px] border border-[#cccccc]"
            />
            {errors.treeName && (
              <p className="text-red-500 text-sm mt-1">{errors.treeName}</p>
            )}
          </div>
          <div className="flex flex-col w-full lg:max-w-[380px]">
            <InputField
              name="cohort"
              placeholder="Cohort"
              type="text"
              onChange={handleChange}
              value={formData.cohort}
              className="text-[16px] border border-[#cccccc]"
            />
            {errors.cohort && (
              <p className="text-red-500 text-sm mt-1">{errors.cohort}</p>
            )}
          </div>
          <div className="flex flex-col w-full lg:max-w-[380px]">
            <CustomDate
              value={formData.datePlanted}
              onChange={handleDateChange}
              className="border border-[#cccccc] !pt-0 !h-[48px]"
            />
            {errors.datePlanted && (
              <p className="text-red-500 text-sm mt-1">{errors.datePlanted}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-between sm:flex-row w-full gap-[15px] md:gap-[55px]">
          <div className="flex flex-col w-full lg:max-w-[380px] gap-2">
            <label className="text-[16px] text-[#404040] font-semibold">
              Day 1
            </label>
            {formData.images.find((img: any) => img.day === 1)?.image ? (
              <div className="w-full h-auto relative">
                <Image
                  src={
                    formData.images.find((img: any) => img.day === 1)?.image ??
                    ""
                  }
                  alt="Day 1"
                  width={100}
                  height={100}
                  className="w-full h-[250px] sm:h-[200px] lg:h-[250px] object-fill"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(1)}
                  className="absolute top-1 right-[6px] bg-gray-500 text-white rounded-full p-1"
                >
                  <IoMdClose size={20} />
                </button>
              </div>
            ) : (
              <>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="plant-image-1"
                    name="image"
                    onChange={(e: any) => handleImageChange(e, 1)}
                  />
                  <label
                    htmlFor="plant-image-1"
                    className="flex justify-between items-center w-full cursor-pointer border border-[#999999] p-2"
                  >
                    <p className="text-nowrap text-[#555555] font-normal">
                      Attach photo
                    </p>
                    <CustomButton
                      label="Choose File"
                      className="flex !bg-[#DDDDDD] text-[12px] sm:text-[16px] sm:!px-4 w-fit !text-[#666666] rounded-full border !p-2 md:!py-1 -z-10"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col w-full lg:max-w-[380px] gap-2">
            <label className="text-[16px] text-[#404040] font-semibold">
              Day 60
            </label>
            {formData.images.find((img: any) => img.day === 60)?.image ? (
              <div className="w-full h-auto relative">
                <Image
                  src={
                    formData.images.find((img: any) => img.day === 60)?.image ??
                    ""
                  }
                  alt="Day 60"
                  width={100}
                  height={100}
                  className="w-full h-[250px] sm:h-[200px] lg:h-[250px] object-fill"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(60)}
                  className="absolute top-1 right-[6px] bg-gray-500 text-white rounded-full p-1"
                >
                  <IoMdClose size={20} />
                </button>
              </div>
            ) : (
              <>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="plant-image-60"
                    name="image"
                    onChange={(e: any) => handleImageChange(e, 60)}
                  />
                  <label
                    htmlFor="plant-image-60"
                    className="flex justify-between items-center w-full cursor-pointer border border-[#999999] p-2"
                  >
                    <p className="text-nowrap text-[#555555] font-normal">
                      Attach photo
                    </p>
                    <CustomButton
                      label="Choose File"
                      className="flex !bg-[#DDDDDD] text-[12px] sm:text-[16px] sm:!px-4 w-fit !text-[#666666] rounded-full border !p-2 md:!py-1 -z-10"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
            <div className="flex flex-col w-full lg:max-w-[380px] gap-2">
              <label className="text-[16px] text-[#404040] font-semibold">
                Day 90
              </label>
              {formData.images.find((img: any) => img.day === 90)?.image ? (
                <div className="w-full h-auto relative">
                  <Image
                    src={
                      formData.images.find((img: any) => img.day === 90)
                        ?.image ?? ""
                    }
                    alt="Day 90"
                    width={100}
                    height={100}
                    className="w-full h-[250px] sm:h-[200px] lg:h-[250px] object-fill"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(90)}
                    className="absolute top-1 right-[6px] bg-gray-500 text-white rounded-full p-1"
                  >
                    <IoMdClose size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="plant-image-90"
                      name="image"
                      onChange={(e: any) => handleImageChange(e, 90)}
                    />
                    <label
                      htmlFor="plant-image-90"
                      className="flex justify-between items-center w-full cursor-pointer border border-[#999999] p-2"
                    >
                      <p className="text-nowrap text-[#555555] font-normal">
                        Attach photo
                      </p>
                      <CustomButton
                        label="Choose File"
                        className="flex !bg-[#DDDDDD] text-[12px] sm:text-[16px] sm:!px-4 w-fit !text-[#666666] rounded-full border !p-2 md:!py-1 -z-10"
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
        </div>
        <CustomButton
          label="SAVE"
          className="flex w-[210px] font-semibold leading-[19.5px] !rounded-[24px] py-[12px] px-[21px] self-center mt-14"
          callback={handleSave}
          interactingAPI={isLoading}
        />
      </div>
    </div>
  );
}
