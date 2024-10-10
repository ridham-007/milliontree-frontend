"use client";

import { Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomButton from "../ui/CustomButton";
import InputField from "../ui/CustomInputFild";
import CustomTextField from "../ui/CustomTextField";
import CustomDate from "../ui/CustomDate";
import RichTextEditor from "../RichTextEditor";
import { addUpdateBlog } from "@/app/_actions/actions";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireStorage } from "@/utils/firebase";
import { v4 as uuidv4 } from "uuid";
interface updateBlogProps {
  data?: any;
  setSHowEditBlog?: any;
  refetchData?: any;
}
interface FormData {
  title: string;
  _id: string;
  content: any;
  featureImage: string;
  location: string;
  createDate: string;
  creditBy: string;
  description: string;
  status: boolean;
  type: string;
  slug: string;
  jsonContent: any;
}

export default function UpdateBlog({
  data,
  setSHowEditBlog,
  refetchData,
}: updateBlogProps) {
  const initialFormData: FormData = {
    title: "",
    featureImage: "",
    _id: "",
    content: { jsonData: {}, htmlContent: "" },
    location: "",
    description: "",
    creditBy: "",
    createDate: "",
    status: false,
    type: "",
    slug: "",
    jsonContent: undefined,
  };
  const [blog, setBlog] = useState<FormData>(initialFormData);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageFile, setImageFile] = useState<any>(null);

  const isObject = (item: any) => {
    return item && typeof item === "object" && !Array.isArray(item);
  };

  const convertDeepMergeEquivalent = (path: string, value: any) => {
    if (!path) {
      return value;
    }

    const keys = path.split(".");
    const result = {};
    let current: any = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        current[key] = {};
        current = current[key];
      }
    }

    return result;
  };

  function mergeDeep(target: any, source: any) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = mergeDeep(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  const handleOnChange = (
    key: keyof FormData,
    value: any,
    parentKey?: string
  ) => {
    if (parentKey !== undefined && parentKey !== null) {
      let change: any = {};
      change[key] = value;
      change = convertDeepMergeEquivalent(parentKey, change);
      let articleCopy = Object.assign({}, blog);
      let finalArticle = mergeDeep(articleCopy, change);
      setBlog(finalArticle);
    } else {
      setBlog((prevState: any) => ({
        ...prevState,
        [key]: value,
      }));
    }
  };

  const handleBlogImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event && event.target) {
      const { type, files } = event.target;
      if (type === "file" && files && files[0]) {
        const file = files[0];
        const fileUrl = URL.createObjectURL(file);

        setBlog((prevData: FormData) => ({
          ...prevData,
          featureImage: fileUrl,
        }));

        setImageFile(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    let uploadedImageUrl = "";

    if (imageFile) {
      try {
        const { url } = await uploadFile("planted-tree", imageFile);
        uploadedImageUrl = url;
      } catch (error) {
        console.error("Error uploading image file:", error);
        return;
      }
    }
    try {
      const response: any = await addUpdateBlog({
        addUpdateBlog: {
          _id: data._id,
          title: blog.title,
          content: blog.content.htmlData ? blog.content.htmlData : 'Hello',
          creditBy: blog.creditBy,
          createDate: blog.createDate,
          location: blog.location,
          featureImage: uploadedImageUrl || blog.featureImage,
          status: blog.status,
          slug: blog.slug,
          description: blog.description,
          jsonContent: blog.content.jsonData,
        },
      });
      setBlog(initialFormData);
      setSubmitLoading(false);
      setSHowEditBlog(false);
      await refetchData();
    } catch (error) {
      toast.error("Failed to submit contact details. Please try again.");
    }
  };

  useEffect(() => {
    if (data) {
      setBlog(() => ({
        ...data,
        content: { jsonData: data?.jsonContent, htmlData: data?.content },
      }));
    }
  }, [data]);

  return (
    <div className="flex flex-col w-full h-full bg-white items-center px-3 sm:px-5">
      <div className="flex flex-col w-full max-w-[1050px] h-full gap-5 py-10">
        <InputField
          name="title"
          placeholder="Enter Title"
          type="text"
          className="mt-[8px] border border-[#cccccc]"
          label="Title"
          value={blog?.title}
          onChange={(e: any) => handleOnChange("title", e.target.value)}
        />
        <div className="flex flex-col md:flex-row w-full gap-5">
          <InputField
            name="creditBy"
            placeholder="Credit By"
            className="mt-[8px] border border-[#cccccc]"
            label="Credit By"
            value={blog?.creditBy}
            onChange={(e: any) => handleOnChange("creditBy", e.target.value)}
            type={"text"}
          />
          <CustomDate
            label="Create Date"
            value={blog.createDate}
            minDate={true}
            className="h-[48px] mt-2 border border-[#cccccc]"
            onChange={(newValue: any) => {
              handleOnChange("createDate", newValue);
            }}
          />
          <InputField
            name="_id"
            placeholder="Id"
            type="text"
            className="mt-[8px] border border-[#cccccc]"
            label="Id"
            value={blog?._id}
            onChange={(e: any) => handleOnChange("_id", e.target.value)}
            readOnly={true}
          />
          <div className="flex flex-col gap-2">
            <label className="font-medium leading-[24px] text-nowrap">
              Publish blog
            </label>
            <Switch
              checked={blog?.status}
              onChange={() => handleOnChange("status", !blog.status)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#3A8340",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#3A8340",
                },
              }}
            />
          </div>
        </div>
        <InputField
          name="slug"
          placeholder="Slug"
          type="text"
          className="mt-[8px] border border-[#cccccc]"
          label="Slug"
          value={blog?.slug}
          onChange={(e: any) => handleOnChange("slug", e.target.value)}
        />
        <InputField
          name="location"
          placeholder="Enter location"
          type="text"
          className="mt-[8px] border border-[#cccccc]"
          label="Location"
          value={blog?.location}
          onChange={(e: any) => handleOnChange("location", e.target.value)}
        />
        <CustomTextField
          name="description"
          placeholder="Describe about your event and important information "
          className="mt-[8px]"
          label="Description"
          value={blog?.description}
          onChange={(e: any) => handleOnChange("description", e.target.value)}
          height="120px"
        />
        <div className="flex flex-col sm:flex-row w-full gap-5">
          <div className="w-full sm:w-[50%]">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="plant-image"
              name="featureImage"
              onChange={handleBlogImageChange}
            />
            <label
              htmlFor="plant-image"
              className="flex w-full gap-[10px] justify-center border-dashed border items-center border-[#777777] rounded-[10px] px-[40px] py-[40px] sm:py-[50px] mt-1"
            >
              <p className="text-nowrap">Attach photo</p>
              <p
                          className="flex px-3 w-full sm:w-max h-[42px] rounded-lg items-center cursor-pointer !bg-white !text-[#306E1D] border !border-[#306E1D] hover:!bg-white"
                        >Choose File
                        </p>
            </label>
          </div>
          <div className="w-full sm:w-[50%]">
            {blog.featureImage && (
              <Image
                src={blog.featureImage}
                alt="Selected Preview"
                width={150}
                height={150}
                unoptimized
                className="w-[150px] h-[150px] rounded"
              />
            )}
          </div>
        </div>
        <div className="w-full">
          <label className="font-medium leading-[24px]">Content</label>
          {blog?.content?.htmlData && (
            <RichTextEditor
              content={{ jsonData: {}, htmlContent: blog?.content?.htmlData }}
              onChange={(Content: any) => {
                handleOnChange("content", Content);
              }}
            />
          )}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <CustomButton
            label="Back"
            callback={() => {
              setSHowEditBlog(false);
            }}
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
