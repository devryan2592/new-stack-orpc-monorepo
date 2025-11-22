import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
// import AuthGuard from "@/components/auth/auth-guard";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import React from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

interface AppDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AppDashboardLayout({
  children,
}: AppDashboardLayoutProps) {
  return (
    // <AuthGuard>
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="relative overflow-hidden">
        <DashboardHeader />
        <DashboardLayout>{children}</DashboardLayout>
      </SidebarInset>
    </SidebarProvider>
    // </AuthGuard>
  );
}
