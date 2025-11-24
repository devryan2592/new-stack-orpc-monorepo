import DashboardBreadcrumbs from "@/components/dashboard/dashboard-breadcrumbs";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";

interface DashboardHomeProps {
  // Add your page props here
}

const DashboardHome: NextPage<DashboardHomeProps> = (props) => {
  return (
    <div className="flex flex-col gap-4">
      <DashboardBreadcrumbs />
      <DashboardPageHeader
        title="Tours"
        description="Manage tours and tour packages"
      />
    </div>
  );
};

export default DashboardHome;
