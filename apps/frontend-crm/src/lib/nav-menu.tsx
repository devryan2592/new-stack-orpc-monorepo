import {
  Home,
  LucideIcon,
  NotebookPen,
  Settings,
  Image,
  Briefcase,
  MapPin,
  Users,
  FileText,
  Plus,
} from "lucide-react";
import { IconType } from "react-icons";
import { TbBeach } from "react-icons/tb";

type NavMenuItem = {
  title: string;
  url?: string;
  isActive?: boolean;
  icon?: LucideIcon | IconType;
  items?: NavMenuItem[];
};

type NavMenuGroup = {
  groupLabel?: string;
  items: NavMenuItem[];
};

export const getMenuList = (): NavMenuGroup[] => {
  return [
    {
      groupLabel: "Main",
      items: [
        { title: "Dashboard", url: "/", icon: Home },
        {
          title: "Blogs",
          icon: NotebookPen,
          items: [
            {
              title: "View Blogs",
              url: "/blogs",
            },
            {
              title: "Add Blog",
              url: "/blogs/add",
            },
            {
              title: "Categories",
              url: "/blogs/categories",
            },
            {
              title: "Tags",
              url: "/blogs/tags",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "User Management",
      items: [{ title: "Users", url: "/users", icon: Users }],
    },

    {
      groupLabel: "Library",
      items: [{ title: "Image Gallery", url: "/gallery", icon: Image }],
    },

    {
      groupLabel: "Settings",
      items: [
        { title: "Backup & Restore", url: "/settings/backup", icon: Settings },
        { title: "Site Settings", url: "/settings/site", icon: Settings },
      ],
    },
  ];
};

export type { NavMenuItem, NavMenuGroup };
