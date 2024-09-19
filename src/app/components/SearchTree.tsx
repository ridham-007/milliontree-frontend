"use client";
import dynamic from "next/dynamic";

import InputField from "./ui/CustomInputFild";
import CustomButton from "./ui/CustomButton";
import { useState } from "react";
import { getUserByEmail } from "../_actions/actions";

interface SearchTreeProps {}
const DataTable = dynamic(() => import("@/app/components/ui/DataTable"), {
  ssr: false,
});

export default function SearchTree(props: SearchTreeProps) {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<any>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSearch = async () => {
    try {
      if(email){
      const response = await getUserByEmail(email);
      console.log({response});
    }
     
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const tableConfig = {
    notFoundData: " No user found",
    actionPresent: true,
    actionList: ["edit", "delete"],
    // handlePagination: handlePagination,
    // onActionClick: handleActionMenu,
    columns: [
      {
        field: "name",
        headerName: "Name",
      },
      {
        field: "email",
        headerName: "Email",
      },
    ],
    rows: data || [],
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
        <CustomButton
          label="Search"
          className="flex px-2 w-max h-max !bg-[#306E1D] !text-white border !border-[#306E1D]"
        //   callback={handleSearch}
        />
      </div>
      <DataTable tableConfig={tableConfig} />
    </div>
  );
}
