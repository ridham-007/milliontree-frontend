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
];