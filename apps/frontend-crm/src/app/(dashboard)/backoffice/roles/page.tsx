import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import { RolesList } from "./roles-list";

const RolesPage: NextPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <DashboardPageHeader
        title="Roles"
        description="Manage roles and permissions"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <RolesList />
      </div>
    </div>
  );
};

export default RolesPage;
