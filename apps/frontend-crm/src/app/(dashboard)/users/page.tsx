"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import { Plus } from "lucide-react";
import { AppButton } from "@workspace/ui/custom/app-button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { UsersDataTable, UserForm } from "@modules/feature-auth/frontend";

interface UsersPageProps {
  // Add your page props here
}

const UsersPage: NextPage<UsersPageProps> = (props) => {
  const handleCreateClick = () => {};

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Users"
        description="Manage users and their roles / permissions"
        actions={
          <AppButton onClick={handleCreateClick} className="gap-2" icon={Plus}>
            Create User
          </AppButton>
        }
      />
      <UsersDataTable />
    </div>
  );
};

export default UsersPage;
