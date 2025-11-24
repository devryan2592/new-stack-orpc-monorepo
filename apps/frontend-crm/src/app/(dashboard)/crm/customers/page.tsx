import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";

const CustomersPage: NextPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <DashboardPageHeader
        title="Customers"
        description="Manage your customers"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </div>
  );
};

export default CustomersPage;
