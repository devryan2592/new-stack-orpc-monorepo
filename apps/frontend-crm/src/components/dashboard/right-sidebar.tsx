"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { Command } from "lucide-react";
import { useLayoutStore } from "../../store/layout";

export function RightSidebar() {
  const { rightOpen } = useLayoutStore();
  const { open, toggleSidebar } = useSidebar();

  React.useEffect(() => {
    if (rightOpen && !open) toggleSidebar();
    if (!rightOpen && open) toggleSidebar();
  }, [rightOpen, open, toggleSidebar]);

  return (
    <Sidebar
      side="right"
      collapsible="offcanvas"
      className="border-l bg-sidebar-accent/10"
    >
      <SidebarHeader className="border-b py-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Details</span>
                  <span className="truncate text-xs">Right Sidebar</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-8 w-full rounded-md bg-muted/50 mb-2" />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export const RightSidebarContainer = () => {
  return (
    <SidebarProvider
      accessKey="right-sidebar"
      className="w-fit overflow-hidden max-h-dvh hidden md:flex"
    >
      <RightSidebar />
    </SidebarProvider>
  );
};
