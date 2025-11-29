"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { NextPage } from "next";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AppButton } from "@workspace/ui/custom/app-button";
import { LeadsDataTable } from "./_datatable";
import { LeadSheetForm } from "./_forms/lead-sheet-form";

const LeadsPage: NextPage = () => {
  return (
    <DashboardLayout>
      <DashboardLayout.Body>
        <DashboardPageHeader
          title="Leads"
          description="Manage your leads and sales pipeline"
          actions={
            <LeadSheetForm>
              <AppButton variant="default">New Lead</AppButton>
            </LeadSheetForm>
          }
        />
        <LeadsDataTable />
      </DashboardLayout.Body>
    </DashboardLayout>
  );
};

export default LeadsPage;
