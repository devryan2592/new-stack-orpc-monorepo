"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import {
  GalleryVerticalEnd,
  LogOut,
  Sparkles,
  BadgeCheck,
  ChevronsUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { useLayoutStore } from "../../store/layout";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { AUTH_LINKS, DASHBOARD_LINKS } from "@/lib/links";

const SidebarHeaderContent = ({ isMobile }: { isMobile: boolean }) => (
  <div className="sticky top-0 flex shrink-0 items-center justify-center gap-2 z-10">
    <Link
      href="/"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex flex-row items-center gap-2.5 aspect-square"
    >
      <div className="flex justify-center items-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
        <GalleryVerticalEnd className="size-4" />
      </div>
    </Link>
  </div>
);

const MiniNav = () => {
  const { isMobile } = useSidebar();
  const { user: UserData } = useAuth();
  const router = useRouter();

  // Generate initials from user name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push(AUTH_LINKS.LOGIN);
  };

  if (!UserData) return null;

  return (
    <Sidebar
      collapsible="none"
      className="z-50 border-r w-[calc(var(--sidebar-width-icon)_+_1px)] "
    >
      <SidebarHeader className="border-b py-2.5">
        <SidebarHeaderContent isMobile={isMobile} />
      </SidebarHeader>
      <SidebarContent>{/* Add mini nav items here if needed */}</SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer md:h-8 md:p-0 flex justify-center"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {UserData.image && (
                      <AvatarImage src={UserData.image} alt={UserData.name} />
                    )}
                    <AvatarFallback className="rounded-lg">
                      {getInitials(UserData.name)}
                    </AvatarFallback>
                  </Avatar>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={12}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      {UserData.image && (
                        <AvatarImage src={UserData.image} alt={UserData.name} />
                      )}
                      <AvatarFallback className="rounded-lg">
                        {getInitials(UserData.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {UserData.name}
                      </span>
                      <span className="truncate text-xs">{UserData.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href={DASHBOARD_LINKS.ACCOUNT}>
                    <DropdownMenuItem className="cursor-pointer">
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      Account
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export const MiniNavContainer = () => {
  return (
    <SidebarProvider
      accessKey="mini-nav"
      className="w-fit shrink-0 overflow-hidden max-h-dvh hidden md:flex"
      defaultOpen={true}
    >
      <MiniNav />
    </SidebarProvider>
  );
};
