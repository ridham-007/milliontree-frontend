import { IconType } from "react-icons";

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
  { key: '1', href: '', label: 'Blog', value: 'blog', image: "/images/my-dashboard.png", size: 24 },
  { key: '2', href: '', label: 'Event', value: 'event', image: "/images/event-1.png", size: 24 },
];