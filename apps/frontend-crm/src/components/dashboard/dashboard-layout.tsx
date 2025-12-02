"use client";

import * as React from "react";
import { useLayoutStore } from "../../store/layout";
import { MiniNavContainer } from "./mini-nav";
import { LeftSidebarContainer } from "./left-sidebar";
import { RightSidebarContainer } from "./right-sidebar";
import { SidebarInset } from "@workspace/ui/components/sidebar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardFooter } from "./dashboard-footer";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  // We don't need to destructure toggle functions here as they are used in the header
  // But we might want to use the state to adjust layout if needed, though SidebarInset handles a lot
  const { leftOpen, rightOpen } = useLayoutStore();

  return (
    <div className="w-full flex max-h-dvh overflow-hidden">
      <MiniNavContainer />
      <LeftSidebarContainer />
      <SidebarInset className="w-full bg-muted/10 flex flex-col h-dvh">
        <DashboardHeader />
        <main className="flex-1 p-4 overflow-auto">{children}</main>
        <DashboardFooter />
      </SidebarInset>
      <RightSidebarContainer />
    </div>
  );
}
