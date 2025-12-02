"use client";

import { useMemo, useState } from "react";
import { Card } from "@workspace/ui/components/card";
import { DataTable } from "@workspace/ui/data-table";
import { useCustomers } from "@workspace/orpc-client";
import { columns, CustomerRow } from "./columns";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { AlertCircle } from "lucide-react";
import { RowSelectionState } from "@workspace/ui/data-table";

export function CustomersDataTable() {
  const { data: customersData, isLoading, error } = useCustomers();
  const customers = customersData?.data?.customers ?? [];

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const customerRows: CustomerRow[] = useMemo(
    () => (customers ?? []) as CustomerRow[],
    [customers]
  );

  return (
    <div className="space-y-4">
      <Card className="p-0 border-0 shadow-none">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(error as any)?.message || "Failed to load customers"}
            </AlertDescription>
          </Alert>
        )}
        <DataTable
          columns={columns}
          data={customerRows}
          isLoading={isLoading}
          emptyMessage="No customers found."
          loadingMessage="Loading customers..."
          showPagination={true}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </Card>
    </div>
  );
}
