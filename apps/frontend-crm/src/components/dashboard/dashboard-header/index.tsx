"use client";

import ThemeToggle from "@/components/app-ui/theme-toggle";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Separator } from "@workspace/ui/components/separator";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { cn } from "@workspace/ui/lib/utils";
import { FC } from "react";
import { useAuth } from "@/hooks/use-auth";
import DashboardModules from "../dashboard-modules";
import { SidebarTrigger, useSidebar } from "@workspace/ui/components/sidebar";

interface DashboardHeaderProps {
  // Add your props here
  children?: React.ReactNode;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ children }) => {
  const { user } = useAuth();
  const { isMobile, open, openMobile } = useSidebar();

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Default user data for development when auth is disabled
  const displayUser = user || {
    name: "Development User",
    email: "dev@example.com",
    image: undefined,
  };

  return (
    <header
      className={cn(
        "flex w-full border-b border-border shrink-0 items-center gap-2 bg-background transition-all duration-300 ease-in-out",
        "h-16",
        (isMobile || open === false) && "h-12"
      )}
    >
      <div className="flex items-center gap-2 px-4">
        <div className="relative h-full flex items-center">
          {/* <DashboardSidebarToggle /> */}
          <SidebarTrigger />
        </div>
        <div className="flex items-center gap-2">
          {/* We will add modules here */}
          <DashboardModules />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2 px-4">
        <ThemeToggle />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 "
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden sm:inline-block">
            {displayUser.name}
          </span>
          <Avatar className="h-8 w-8">
            {displayUser.image && (
              <AvatarImage src={displayUser.image} alt={displayUser.name} />
            )}
            <AvatarFallback>{getInitials(displayUser.name)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
