"use client";

import { Modal, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { addUpdateBlog, deleteBlog, paginatedBlog } from "@/app/_actions/actions";
import { toast } from "react-toastify";
import UpdateBlog from "./updateBlog";
import CustomButton from "../ui/CustomButton";
import RichTextEditor from "../RichTextEditor";
import InputField from "../ui/CustomInputFild";
import CustomTextField from "../ui/CustomTextField";
import CustomDate from "../ui/CustomDate";
import DataTable from "../ui/DataTable";

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
  jsonContent: any,
}

const style: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '1050px',
};

export default function BlogGenerate({ authId }: blogGenerateProps) {
  const initialFormData: FormData = {
    title: "",
    featureImage: "",
    content: { jsonData: {}, htmlContent: "" },
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
    setLoading(true)
    let updatedEventData: any = {
      page: page + 1,
      limit: limit,
    }
    try {
      const response: any = await paginatedBlog(updatedEventData);

      if (response?.success) {
        setBlogsData(response?.data);
        setLoading(false)
      } else {
        console.error("Failed to fetch blogs:", response.message);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

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

  const handleOnChange = (key: keyof FormData, value: any, parentKey?: string) => {

    if (parentKey !== undefined && parentKey !== null) {
      let change: any = {};
      change[key] = value;
      change = convertDeepMergeEquivalent(parentKey, change);
      let articleCopy = Object.assign({}, blog);
      let finalArticle = mergeDeep(articleCopy, change);
      setBlog(finalArticle);
    } else {
      setBlog((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {

      const response: any = await addUpdateBlog({
        addUpdateBlog: {
          userId: authId,
          title: blog.title,
          createDate: blog.createDate,
          creditBy: blog.creditBy,
          content: blog.content.htmlData,
          featureImage: blog.featureImage,
          status: blog.status,
          location: blog.location,
          slug: blog.slug,
          description: blog.description,
          jsonContent: blog.content.jsonData
        }
      });
      setBlog(initialFormData);
      setSubmitLoading(false);
      paginatedBlogs()
      setOpen(false)

    } catch (error) {
      toast.error("Failed to submit contact details. Please try again.");
    }
  };

  const handleActionMenu = async (type: any, item: any) => {
    if (type === "view") {
      if (window) {
        window.open(`${process.env.NEXT_PUBLIC_URL}/blog-preview/${item?._id}`);
      }
    } else if (type === "edit") {
      setEditBlogData(item)
      setSHowEditBlog(true)
    } else if (type === "delete") {
      const response = await deleteBlog(item?._id);
      if (response) {
        await paginatedBlogs();
      }
    }
  };

  const tableConfig = {
    notFoundData: 'No blogs found',
    actionPresent: true,
    actionList: ["view", "edit", "delete"],
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
          const Status = cur?.status === true ? "Publish" : "UnPublish"
          return (
            <div
              className={`w-max flex  border ${Status === 'Publish' ? 'text-[#4ad29e] bg-[#e3fff5] border-[#4ad29e]' : 'text-[#3A8340] border-[#3A8340] bg-[#fff4ee]'} px-6 py-1 text-[16px] font-medium items-center rounded-md `}
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
      rowPerPage: limit
    },
  };

  useEffect(() => {
    paginatedBlogs()
    setPageLoaded(true)
  }, [page])

  return (
    <>
      {showEditBlog ? (
        < UpdateBlog data={editBlogData} setSHowEditBlog={setSHowEditBlog} refetchData={paginatedBlogs} />
      ) : (<div className="flex flex-col w-full h-full bg-white items-center px-3 sm:px-5 gap-5 py:py-5 sm:py-10">
        <div className="flex justify-end w-full">
          <CustomButton label={'Create Blog'} callback={handleOpen} />
        </div>
        <DataTable tableConfig={tableConfig} isLoading={loading} fixRow={true} />

        {open && (
          <div className="fixed w-full h-full inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div style={style} className="max-w-[1050px] bg-white p-3 sm:p-5 rounded-lg shadow-lg">

              <h2 className="text-xl font-bold py-5">Create Blog</h2>
              <div className="flex flex-col w-full h-[480px] overflow-y-auto custom-scrollbar pr-1 gap-5">
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
                    <label className="font-medium leading-[24px] text-nowrap">Publish blog</label>
                    <Switch
                      checked={blog?.status}
                      onChange={() => handleOnChange("status", !blog.status)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#3A8340',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#3A8340',
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
                      handleOnChange('createDate', newValue);
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
                <InputField
                  name="featureImage"
                  placeholder="Enter featureImage"
                  type="text"
                  className="mt-[8px] border border-[#cccccc]"
                  label="FeatureImage"
                  value={blog?.featureImage}
                  onChange={(e: any) => handleOnChange("featureImage", e.target.value)}
                />
                <div className="w-full">
                  <label className="font-medium leading-[24px]">Content</label>
                  {pageLoaded && <RichTextEditor
                    content={{ jsonData: {}, htmlContent: blog?.content?.htmlData }}
                    onChange={(Content: any) => {
                      console.log(Content);
                      handleOnChange('content', Content)
                    }}
                  />}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <CustomButton label="Cancel" callback={handleClose} className="!text-black !bg-transparent" />
                <CustomButton label="Submit" callback={handleSubmit} interactingAPI={submitLoading || false} className="!w-[90px]" />
              </div>
            </div>
          </div>
        )}
      </div>)}
    </>
  );
}
