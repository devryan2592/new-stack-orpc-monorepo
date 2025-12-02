"use client";

import { Sidebar, SidebarContent } from "@workspace/ui/components/sidebar";
import { ComponentProps, FC } from "react";
import SidebarHeader from "./sidebar-header";
import SidebarNav from "./sidebar-nav";
import SidebarFooter from "./sidebar-footer";
import SidebarModuleSelector from "./sidebar-module-selector";

const DashboardSidebar: FC<ComponentProps<typeof Sidebar>> = ({
  children,
  ...props
}) => {
  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarModuleSelector />
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default DashboardSidebar;
