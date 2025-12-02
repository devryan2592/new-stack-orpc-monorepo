"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import { AppButton } from "@workspace/ui/custom/app-button";
import { UsersDataTable } from "./_datatable";
// import { UsersDialogForm } from "./_forms/users-dialog-form";

const UsersPage: NextPage = () => {
  return (
    <>
      <DashboardPageHeader title="Users" description="Manage users" />
      <UsersDataTable />
    </>
  );
};

export default UsersPage;
