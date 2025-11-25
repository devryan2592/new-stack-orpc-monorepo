"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AppButton } from "@workspace/ui/custom/app-button";
import { UsersDataTable } from "@/app/(dashboard)/crm/users/_datatable";
import { UsersDialogForm } from "@/app/(dashboard)/backoffice/staff/_forms/users-dialog-form";

const UsersPage: NextPage = () => {
  return (
    <DashboardLayout>
      <DashboardLayout.Body>
        <DashboardPageHeader
          title="Users"
          description="Manage users"
          actions={
            <UsersDialogForm>
              <AppButton variant="default">New User</AppButton>
            </UsersDialogForm>
          }
        />
        <UsersDataTable />
      </DashboardLayout.Body>
    </DashboardLayout>
  );
};

export default UsersPage;
