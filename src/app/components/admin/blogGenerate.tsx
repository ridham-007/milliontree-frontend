"use client";

import { Switch } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  addUpdateBlog,
  deleteBlog,
  paginatedBlog,
} from "@/app/_actions/actions";
import { toast } from "react-toastify";
import UpdateBlog from "./updateBlog";
import CustomButton from "../ui/CustomButton";
import InputField from "../ui/CustomInputFild";
import CustomTextField from "../ui/CustomTextField";
import CustomDate from "../ui/CustomDate";
import DataTable from "../ui/DataTable";
import { fireStorage } from "@/utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { RiCloseCircleLine } from "react-icons/ri";
import CustomModal from "../ui/CustomModel";
import dynamic from "next/dynamic";
const CustomEditor = dynamic( () => import( '../custom-editor' ), { ssr: false } );

interface blogGenerateProps {
  authId?: string;
}
interface FormData {
  title: string;
  content: any;
  createDate: string;
  location: string;
  creditBy: string;
  featureImage: string;
  description: string;
  status: boolean;
  slug: string;
  jsonContent: any;
}

export default function BlogGenerate({ authId }: blogGenerateProps) {
  const initialFormData: FormData = {
    title: "",
    featureImage: "",
    content: "",
    description: "",
    location: "",
    creditBy: "",
    createDate: "",
    status: false,
    slug: "",
    jsonContent: undefined,
  };
  const [blog, setBlog] = useState<FormData>(initialFormData);
  const [showEditBlog, setSHowEditBlog] = useState(false);
  const [editBlogData, setEditBlogData] = useState<any>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageFile, setImageFile] = useState<any>(null);
  const [blogsData, setBlogsData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let limit = 5;

  const handlePagination = (curPage: number) => {
    setPage(curPage);
  };

  const paginatedBlogs = async () => {
    setLoading(true);
    let updatedEventData: any = {
      page: page + 1,
      limit: limit,
    };
    try {
      const response: any = await paginatedBlog(updatedEventData);

      if (response?.success) {
        setBlogsData(response?.data);
        setLoading(false);
      } else {
        console.error("Failed to fetch blogs:", response.message);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleOnChange = (key: keyof FormData, value: any) => {
      setBlog((prevState) => ({
        ...prevState,
        [key]: value,
      }));
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
    setSubmitLoading(false);
    try {
      const response: any = await addUpdateBlog({
        addUpdateBlog: {
          userId: authId,
          title: blog.title,
          createDate: blog.createDate,
          creditBy: blog.creditBy,
          content: blog.content? blog.content : 'Hello',
          featureImage: uploadedImageUrl || blog.featureImage,
          status: blog.status,
          location: blog.location,
          slug: blog.slug,
          description: blog.description,
          jsonContent: blog.jsonContent,
        },
      });
      setBlog(initialFormData);
      setSubmitLoading(false);
      paginatedBlogs();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to submit contact details. Please try again.");
    }
  };

  const handleActionMenu = async (type: any, item: any) => {
    if (type === "view") {
      // if (window) {
      //   window.open(`${process.env.NEXT_PUBLIC_URL}/blog-preview/${item?._id}`);
      // }
    } else if (type === "edit") {
      setEditBlogData(item);
      setSHowEditBlog(true);
    } else if (type === "delete") {
      const response = await deleteBlog(item?._id);
      if (response) {
        await paginatedBlogs();
      }
    }
  };

  const tableConfig = {
    notFoundData: "No blogs found",
    actionPresent: true,
    actionList: ["edit", "delete"],
    handlePagination: handlePagination,
    onActionClick: handleActionMenu,
    columns: [
      {
        field: "title",
        headerName: "Title",
      },
      {
        field: "status",
        headerName: "Publish",
        customRender: (cur: any) => {
          const Status = cur?.status === true ? "Publish" : "UnPublish";
          return (
            <div
              className={`w-max flex ${
                Status === "Publish"
                  ? "text-[#4fb658] bg-[#e7fae9]"
                  : "text-[#eab63c] bg-[#fcf4e2]"
              } px-6 py-1 text-[16px] font-medium items-center rounded-md `}
            >
              {Status}
            </div>
          );
        },
      },
    ],
    rows: blogsData?.blogs || [],
    pagination: {
      totalResults: blogsData?.total,
      totalPages: Math.ceil((blogsData?.total || 0) / limit),
      currentPage: page,
      rowPerPage: limit,
    },
  };

  useEffect(() => {
    paginatedBlogs();
    setPageLoaded(true);
  }, [page]);

  const modelData = (
    <>
      <div className="flex justify-between px-8 py-4 border-b items-center">
        <p className="text-[22px] font-semibold">Create Blog</p>
        <RiCloseCircleLine
          size={24}
          onClick={handleClose}
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col w-full h-[480px] overflow-y-auto custom-scrollbar py-4 px-8 gap-5">
        <InputField
          name="title"
          placeholder="Enter Title"
          type="text"
          className="mt-[8px] border border-[#cccccc]"
          label="Title"
          value={blog?.title}
          onChange={(e: any) => handleOnChange("title", e.target.value)}
        />
        <div className="flex flex-col sm:flex-row w-full gap-5">
          <InputField
            name="slug"
            placeholder="Slug"
            type="text"
            className="mt-[8px] border border-[#cccccc]"
            label="Slug"
            value={blog?.slug}
            onChange={(e: any) => handleOnChange("slug", e.target.value)}
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
        <div className="flex flex-col sm:flex-row w-full gap-5">
          <InputField
            name="creditBy"
            placeholder="Credit By"
            className="mt-[8px] border border-[#cccccc]"
            label="Credit By"
            value={blog?.creditBy}
            onChange={(e: any) => handleOnChange("creditBy", e.target.value)}
            type="text"
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
        </div>
        <InputField
          name="location"
          placeholder="Enter location"
          className="mt-[8px] border border-[#cccccc]"
          label="Location"
          value={blog?.location}
          onChange={(e: any) => handleOnChange("location", e.target.value)}
          type="text"
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
              className="hidden w-full sm:w-max"
              id="plant-image"
              name="featureImage"
              onChange={handleBlogImageChange}
            />
            <label
              htmlFor="plant-image"
              className="flex w-full gap-[10px] justify-center border-dashed border items-center border-[#777777] rounded-[10px] px-[40px] py-[40px] lg:py-[50px] mt-1"
            >
              <p className="text-nowrap">Attach photo</p>
              <CustomButton
                label="Choose File"
                className="flex px-2 w-full sm:w-max h-max !bg-white !text-[#306E1D] border !border-[#306E1D] hover:!bg-white -z-10"
              />
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
          <div id="editor"></div>
          {pageLoaded && (
            <CustomEditor data={blog?.content} onChange={handleOnChange} />
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4 p-4">
        <CustomButton
          label="Cancel"
          callback={handleClose}
          className="!text-black !bg-transparent"
        />
        <CustomButton
          label="Submit"
          callback={handleSubmit}
          interactingAPI={submitLoading || false}
          className="!w-[90px]"
        />
      </div>
    </>
  );

  return (
    <>
      {showEditBlog ? (
        <UpdateBlog
          data={editBlogData}
          setSHowEditBlog={setSHowEditBlog}
          refetchData={paginatedBlogs}
        />
      ) : (
        <div className="flex flex-col w-full h-full bg-white items-center px-3 sm:px-5 gap-5 py:py-5 sm:py-10">
          <div className="flex justify-end w-full">
            <CustomButton label={"Create Blog"} callback={handleOpen} />
          </div>
          <DataTable
            tableConfig={tableConfig}
            isLoading={loading}
            paginatedData={true}
          />
          <CustomModal handleClose={handleClose} open={open} modelData={modelData} modelWidth= '1050px'/>
        </div>
      )}
    </>
  );
}
