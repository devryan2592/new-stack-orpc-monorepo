"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AppButton } from "@workspace/ui/custom/app-button";
import { RolesDataTable } from "@/datatables/roles-data-table";
import { RolesDialogForm } from "@/forms/dialog-forms/roles-dialog-form";

const RolesPage: NextPage = () => {
  return (
    <DashboardLayout>
      <DashboardLayout.Body>
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
      </DashboardLayout.Body>
    </DashboardLayout>
  );
};

export default RolesPage;
