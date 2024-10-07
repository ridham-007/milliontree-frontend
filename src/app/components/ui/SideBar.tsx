import Link from "next/link";
import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import { adminData } from "@/utils/admin-data";
import { usePathname, useRouter } from "next/navigation";

interface DashboardSidebarProps {
  onSidebarItemClick: (label: string) => void;
  queryParams: any;
  eventsDetails: any;
  selectedTab?: string;
  unseenCount?: number;
}

const Sidebar = ({
  onSidebarItemClick,
  queryParams,
  eventsDetails,
  selectedTab,
  unseenCount,
}: DashboardSidebarProps) => {
  const pathName = usePathname();
  const [hidden, setHidden] = useState(false);
  const [selected, setSelected] = useState<string>(selectedTab ?? "");

  const handleLinkClick = (label: string) => {
    setSelected(label);
    onSidebarItemClick(label);
  };
  console.log({ queryParams });

  // useEffect(() => {
  //   if (queryParams?.tab) {
  //     onSidebarItemClick(queryParams?.tab);
  //     setSelected(queryParams?.tab);
  //   } else {
  //     onSidebarItemClick(selected);
  //   }
  // }, [queryParams?.tab, selected, onSidebarItemClick]);

  const tabData: any = pathName === "/admin" && adminData;

  return (
    <div
      className={`lg:flex flex-col h-full gap-3 pt-5 relative transition-all transform duration-500 ease-in-out px-2 md:px-4 border border-[#f5f5f5] shadow-sm ${
        hidden ? "w-64" : "w-[55px] min-w-[50px] md:w-[88px]"
      }`}
    >
      {tabData?.map((item: any, index: number) => {
        if (item.label === "Organizer" && eventsDetails?.length === 0) {
          return null;
        }
        if (item.label === "Promo Codes" && eventsDetails?.length === 0) {
          return null;
        }

        return (
          <Link
            href={item.href}
            key={index}
            onClick={() => handleLinkClick(item.value)}
            className={`flex px-[4px] py-[10px] md:px-4 md:py-4 items-center rounded-lg ${
              selectedTab === item.value
                ? "bg-[#3A8340]"
                : "text-[#333333] text-[16px] hover:bg-[#f5f5f5] hover:text-[#3A8340]"
            }`}
          >
            <div className="flex items-center">
              {item.icon && (
                <>
                  {hidden ? (
                    <>
                      <item.icon size={item.size} color={ selectedTab === item.value ? 'white' : 'black'}/>{" "}
                      <div className={`pl-2 ${ selectedTab === item.value ? 'text-white' : 'text-black'}`}>{item.label}</div>{" "}
                    </>
                  ) : (
                    <Tooltip title={item.label} placement="right" arrow>
                      <div>
                        <item.icon size={item.size} color={ selectedTab === item.value ? 'white' : 'black'}/>{" "}
                      </div>
                    </Tooltip>
                  )}
                </>
              )}
            </div>
          </Link>
        );
      })}
      <div
        className="hidden md:flex absolute rounded-full shadow-md right-[-12px] bg-white cursor-pointer"
        onClick={() => setHidden(!hidden)}
      >
        <MdKeyboardArrowRight
          size={24}
          className={`${
            hidden ? "rotate-180" : ""
          } transform transition-transform duration-500 ease-in-out`}
        />
      </div>
    </div>
  );
};

export default Sidebar;
