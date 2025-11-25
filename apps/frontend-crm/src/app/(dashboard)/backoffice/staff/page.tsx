"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AppButton } from "@workspace/ui/custom/app-button";
import { StaffDataTable } from "@/app/(dashboard)/backoffice/staff/_datatable";
import { UsersDialogForm } from "@/app/(dashboard)/backoffice/staff/_forms/users-dialog-form";

const StaffPage: NextPage = () => {
  return (
    <DashboardLayout>
      <DashboardLayout.Body>
        <DashboardPageHeader
          title="Staff"
          description="Manage staff members"
          actions={
            <UsersDialogForm>
              <AppButton variant="default">New Staff</AppButton>
            </UsersDialogForm>
          }
        />
        <StaffDataTable />
      </DashboardLayout.Body>
    </DashboardLayout>
  );
};

export default StaffPage;
