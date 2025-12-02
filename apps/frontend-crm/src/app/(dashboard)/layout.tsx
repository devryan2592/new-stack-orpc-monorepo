import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import AuthGuard from "@/providers/auth-guard";
import React from "react";

interface AppDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AppDashboardLayout({
  children,
}: AppDashboardLayoutProps) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
