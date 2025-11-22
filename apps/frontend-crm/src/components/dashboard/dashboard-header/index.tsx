"use client";

import ThemeToggle from "@/components/app-ui/theme-toggle";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { cn } from "@workspace/ui/lib/utils";
import { FC } from "react";
import DashboardBreadcrumbs from "../dashboard-breadcrumbs";
import { useAuth } from "@modules/feature-auth/frontend/hooks/use-auth";

interface DashboardHeaderProps {
  // Add your props here
  children?: React.ReactNode;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ children }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  console.log(user);

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
        "fixed top-0 right-0 left-0 flex border-b border-border shrink-0 items-center gap-2 z-10 bg-background transition-all duration-300 ease-in-out",
        // Desktop: default height 64px, collapsed sidebar makes it 48px, left margin 256px, collapsed makes it 48px
        "h-16 ml-64 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 group-has-data-[collapsible=icon]/sidebar-wrapper:ml-12",
        // Mobile: always height 48px, no left margin
        isMobile && "ml-0 h-12"
      )}
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 "
        />
        <DashboardBreadcrumbs />
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
