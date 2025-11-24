import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import AuthGuard from "@/providers/auth-guard";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import React from "react";

interface AppDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AppDashboardLayout({
  children,
}: AppDashboardLayoutProps) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset className="relative h-svh overflow-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
