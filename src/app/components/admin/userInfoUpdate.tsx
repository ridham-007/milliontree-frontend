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
import { paginatedUsers, userInfoUpdate } from "@/app/_actions/auth-action";
import { RiCloseCircleLine } from "react-icons/ri";
import CustomModal from "../ui/CustomModel";
import CustomSelection from "../ui/CustomSelect";

interface UserUpdateProps {
  authId?: string;
}

interface FormData {
    fName: string;
    lName: string;
    userRole: string;
}


const userRole = [
    { label: "Public", value: "public" },
    { label: "Admin", value: "admin" },
  ];

export default function UserUpdate({ }: UserUpdateProps) {
    const [editUserData, setEditUserData] = useState<FormData>({ fName: "", lName: "", userRole: "" });
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [usersData, setUsersData] = useState<any>();
    const [openModel, setOpenModel] = useState(false);
    const [page, setPage] = useState(0);
    let limit = 5;

    const handlePagination = (curPage: number) => {
        setPage(curPage);
    };
    
    const handleModelClose = () => {
        setOpenModel(false);
    };

    const handleActionMenu = async (type: any, item: any) => {
        if (type === "edit") {
            setEditUserData(item)
            setOpenModel(true)
        } else if (type === "delete") {
            // const response = await deleteUser(item?._id);
            // if (response) {
            //     await events();
            // }
        }
    };

    const handleOnChange = (e: any | { name: string, value: string }) => {
        const { name, value } = e ? e.target : e;
        setEditUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRoleChange = (selectedRole: { label: string, value: string }) => {
        setEditUserData((prevData) => ({
            ...prevData,
            userRole: selectedRole.value,
        }));
    };
    
    const users = async () => {
        setLoading(true)
        let updatedEventData: any = {
            page: page + 1,
            limit: limit,
        }
        try {
            const response: any = await paginatedUsers(updatedEventData);
            
            if (response?.success) {
                setUsersData(response?.data);
                setLoading(false)
            }else {
              console.error("Failed to fetch users:", response?.message);
          }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const res = await userInfoUpdate(JSON.stringify(editUserData));
            if(res?.data){
                users()
                setIsLoading(false)
            }
            setOpenModel(false)
        } catch (error) {
        }
      };

    const tableConfig = {
        notFoundData: 'No Users found',
        actionPresent: true,
        actionList: ["edit", "delete"],
        handlePagination: handlePagination,
        onActionClick: handleActionMenu,
        columns: [
            {
                field: "name",
                headerName: "Name",
                customRender: (row: any) => {
                  const name = `${row?.fName} ${row?.lName}`;
                  return <div>{name}</div>;
                },
              },
              {
                field: "email",
                headerName: "Email",
            },
            {
                field: "userRole",
                headerName: "User Role",
            },
        ],
        rows: usersData?.users || [],
        pagination: {
            totalResults: usersData?.total,
            totalPages: Math.ceil((usersData?.total || 0) / limit),
            currentPage: page,
            rowPerPage: limit
        },
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
                name="fName"
                placeholder="Enter your first name"
                type="text"
                onChange={handleOnChange}
                value={editUserData.fName}
                className="text-[16px] mt-[8px] rounded-[8px] border border-[#f4f4f4]"
                label={"First name"}
                bgColor="#F4F4F4"
              />
              {/* {errors.eventName && (
                <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
              )} */}
            </div>
            <div>
              <InputField
                name="lName"
                placeholder="Enter your last name"
                type="text"
                onChange={handleOnChange}
                value={editUserData.lName}
                className="text-[16px] mt-[8px] rounded-[8px] border border-[#f4f4f4]"
                label={"Last name"}
                bgColor="#F4F4F4"
              />
              {/* {errors.eventName && (
                <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
              )} */}
            </div>
                <CustomSelection
            className="!w-[220px] md:!w-[380px] rounded-none "
            placeholder={"Please select"}
            label="Select event"
            data={userRole}
            value={userRole.find(role => role?.value === editUserData?.userRole)}
            onChange={(e:any) => handleRoleChange(e)}
          />
             
           
            <div className="flex w-full justify-end pt-4">
              <CustomButton
                label="Save"
                className="flex px-2 !w-[70px] h-[42px] !bg-[#306E1D] !text-white border !border-[#306E1D]"
                callback={handleSubmit}
                interactingAPI={isLoading}
              />
            </div>
          </div>
        </>
      );

    useEffect(() => {
        users()
    }, [page])

  return (
    <>
    <div className="flex flex-col w-full h-full bg-white items-center px-3 sm:px-5 gap-5 py:py-5 sm:py-10">
        <DataTable tableConfig={tableConfig} isLoading={loading} paginatedData={true} />
        <CustomModal handleClose={handleModelClose} open={openModel} modelData={modelData} />
    </div>
    </>
  );
}
