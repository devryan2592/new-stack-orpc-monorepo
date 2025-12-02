"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import { AppButton } from "@workspace/ui/custom/app-button";
import { RolesDataTable } from "./_datatable";
import { RolesDialogForm } from "./_forms/roles-dialog-form";

const RolesPage: NextPage = () => {
  return (
    <>
      <DashboardPageHeader
        title="Roles"
        description="Manage roles and permissions"
        actions={
          <RolesDialogForm>
            <AppButton variant="default">New Role</AppButton>
          </RolesDialogForm>
        }
      />
      <RolesDataTable />
    </>
  );
};

export default RolesPage;
