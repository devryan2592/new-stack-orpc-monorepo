"use client";

import { CustomersDataTable } from "./_datatable";
import { CustomerSheetForm } from "./_forms/customer-sheet-form";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customers here.
          </p>
        </div>
        <CustomerSheetForm>
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Customer
            </Button>
        </CustomerSheetForm>
      </div>

      <CustomersDataTable />
    </div>
  );
}
