import { IconType } from "react-icons";
import { FaBloggerB } from "react-icons/fa";
import { TbCalendarEvent } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi";
interface AdminItem {
  key: string;
  href: string;
  label: string;
  value: string;
  icon?: IconType;
  size: number;
  image?: string;
}

export const adminData: AdminItem[] = [
  { key: '1', href: '', label: 'Blog', value: 'blog', icon: FaBloggerB , size: 24 },
  { key: '2', href: '', label: 'Event', value: 'event', icon: TbCalendarEvent , size: 24 },
  { key: '3', href: '', label: 'Users', value: 'users', icon: HiOutlineUsers , size: 24 },
];