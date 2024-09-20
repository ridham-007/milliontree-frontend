"use client";
import dynamic from "next/dynamic";

import InputField from "./ui/CustomInputFild";
import CustomButton from "./ui/CustomButton";
import { useState } from "react";
import { deleteUserById, getUserByEmail } from "../_actions/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface SearchTreeProps {}
const DataTable = dynamic(() => import("@/app/components/ui/DataTable"), {
  ssr: false,
});

export default function SearchTree(props: SearchTreeProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [userData, setUserData] = useState<any>();
  const [refetch, setRefetch] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
      if (response?.data) {
        const user = response.data;
        setUserData([user]);
      } else {
        console.error("Failed to fetch user data:", response);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setIsLoading(false)

  };

  const handleClear = () => {
    setUserData([])  
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    const response = await deleteUserById(userId);
    if(response?.data?.success){
      toast(response?.data?.message)
      setUserData([])  
    }
    setLoading(false);
  };

  const handleEdit = async (userId: string) => {
    router.push(`/track/${userId}`);
  };

  const handleActionMenu = (value: string, user: any) => {
    if (value === "edit") {
      handleEdit(user?._id);
    }
    if (value === "delete") {
      deleteUser(user?._id);
    }
  };
  
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
      <div className="flex flex-col sm:flex-row w-full lg:w-[60%] items-end gap-2">
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
          className="flex px-2 !w-[83px] h-max !bg-[#306E1D] !text-white border !border-[#306E1D]"
          callback={handleSearch}
          interactingAPI={isLoading}
        />
         <CustomButton
          label="Clear"
          className="flex px-2 !w-[83px] h-max !bg-white !text-[#306E1D] border !border-[#306E1D]"
          callback={handleClear}
        />
        </div>
      </div>
      <div className="w-full max-w-[800px]">
      <DataTable tableConfig={tableConfig} />
      </div>
    </div>
  );
}
