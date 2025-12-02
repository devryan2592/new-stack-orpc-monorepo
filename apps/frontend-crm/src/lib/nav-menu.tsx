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
  LayoutDashboard,
  Contact,
  UserCircle,
  Shield,
  Globe,
} from "lucide-react";
import { IconType } from "react-icons";
import { AuthUser } from "@/hooks/use-auth";
import { isAdmin } from "@/lib/auth-utils";
import {
  BACKOFFICE_LINKS,
  CRM_LINKS,
  DASHBOARD_LINKS,
  WEBSITE_LINKS,
} from "./links";
import { MODULES, ModuleId } from "./modules";

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

export const getMenuList = (
  moduleId: ModuleId,
  user?: AuthUser
): NavMenuGroup[] => {
  switch (moduleId) {
    case MODULES.CRM:
      return [
        {
          groupLabel: "CRM",
          items: [
            { title: "Dashboard", url: CRM_LINKS.HOME, icon: LayoutDashboard },
            { title: "Leads", url: CRM_LINKS.LEADS, icon: Contact },
            { title: "Customers", url: CRM_LINKS.CUSTOMERS, icon: Users },
            { title: "Quotations", url: CRM_LINKS.QUOTATIONS, icon: FileText },
          ],
        },
        ...(isAdmin(user)
          ? [
              {
                groupLabel: "Management",
                items: [
                  { title: "Users", url: CRM_LINKS.USERS, icon: UserCircle },
                ],
              },
            ]
          : []),
      ];
    case MODULES.BACKOFFICE:
      return [
        {
          groupLabel: "Backoffice",
          items: [
            {
              title: "Dashboard",
              url: BACKOFFICE_LINKS.HOME,
              icon: LayoutDashboard,
            },
            { title: "Staff", url: BACKOFFICE_LINKS.STAFF, icon: Briefcase },
            { title: "Roles", url: BACKOFFICE_LINKS.ROLES, icon: Shield },
          ],
        },
      ];
    case MODULES.WEBSITE:
      return [
        {
          groupLabel: "Website",
          items: [
            {
              title: "Dashboard",
              url: WEBSITE_LINKS.HOME,
              icon: LayoutDashboard,
            },
            { title: "Content", url: WEBSITE_LINKS.CONTENT, icon: Globe },
            {
              title: "Blogs",
              icon: NotebookPen,
              items: [
                {
                  title: "All Blogs",
                  url: WEBSITE_LINKS.BLOGS,
                },
              ],
            },
            { title: "Gallery", url: WEBSITE_LINKS.GALLERY, icon: Image },
          ],
        },
      ];
    default:
      return [];
  }
};

export type { NavMenuItem, NavMenuGroup };
