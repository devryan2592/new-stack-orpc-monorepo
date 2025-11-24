import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";

const StaffPage: NextPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <DashboardPageHeader title="Staff" description="Manage staff members" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="h-96 w-96 bg-gray-300" />
        <div className="h-96 w-96 bg-gray-300" />
        <div className="h-96 w-96 bg-gray-300" />
        <div className="h-96 w-96 bg-gray-300" />
        <div className="h-96 w-96 bg-gray-300" />
        <div className="h-96 w-96 bg-gray-300" />
      </div>
    </div>
  );
};

export default StaffPage;
