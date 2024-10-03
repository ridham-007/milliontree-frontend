"use client";

import { useState } from "react";
import BlogGenerate from "./admin/blogGenerate";
import Sidebar from "./ui/SideBar";
interface AdminProps {
  queryParams?: any;
  authId?: any;
}

export default function Admin({ queryParams, authId }: AdminProps) {
  const [selectedTab, setSelectedTab] = useState<string | null>('blog');
  const handleSidebarItemClick = (label: string) => {
    setSelectedTab(label);
  };

  return (
    <div className="flex w-full h-full mt-[90px]">
      <div className={`flex w-full h-full`}>
        <Sidebar onSidebarItemClick={handleSidebarItemClick} queryParams={queryParams} selectedTab={selectedTab ?? ''} eventsDetails={undefined} />
        <div className="w-full bg-[#FAFAFA]">
          {selectedTab === "blog" && <BlogGenerate authId={authId} />}
        </div>
      </div>
    </div>
  );
}
