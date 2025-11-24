"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import { RolesList } from "./roles-list";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AppButton } from "@workspace/ui/custom/app-button";
import { RolesDialogForm } from "../../../../forms/roles-dialog-form";

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
        <RolesList />
      </DashboardLayout.Body>
    </DashboardLayout>
  );
};

export default RolesPage;
