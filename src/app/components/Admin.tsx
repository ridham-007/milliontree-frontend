"use client";

import { useState } from "react";
import BlogGenerate from "./admin/blogGenerate";
import Sidebar from "./ui/SideBar";
import Event from "./admin/eventCreation";
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
    <div className="flex w-full h-full mt-[120px] md:mt-[140px]">
      <div className={`flex w-full h-full`}>
        <Sidebar onSidebarItemClick={handleSidebarItemClick} queryParams={queryParams} selectedTab={selectedTab ?? ''} eventsDetails={undefined} />
        <div className="w-full bg-[#FAFAFA]">
          {selectedTab === "blog" && <BlogGenerate authId={authId} />}
          {selectedTab === "event" && <Event />}
        </div>
      </div>
    </div>
  );
}
