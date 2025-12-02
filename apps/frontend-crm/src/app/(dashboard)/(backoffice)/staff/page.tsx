"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import { AppButton } from "@workspace/ui/custom/app-button";
import { StaffDataTable } from "./_datatable";
import { UsersDialogForm } from "./_forms/users-dialog-form";

const StaffPage: NextPage = () => {
  return (
    <>
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
    </>
  );
};

export default StaffPage;
