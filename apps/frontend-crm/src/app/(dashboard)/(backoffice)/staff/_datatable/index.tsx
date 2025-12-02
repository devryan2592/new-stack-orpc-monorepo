"use client";

import { useMemo } from "react";
import { Card } from "@workspace/ui/components/card";
import { DataTable } from "@workspace/ui/data-table";
import { useUsers } from "@workspace/orpc-client";
import { columns, StaffRow } from "./columns";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { AlertCircle } from "lucide-react";

export function StaffDataTable() {
  const {
    data: users,
    isLoading,
    error,
  } = useUsers({
    roles: ["admin", "superadmin", "staff", "editor", "manager"],
  });

  const staffRows: StaffRow[] = useMemo(
    () => (users?.data?.users ?? []) as StaffRow[],
    [users]
  );

  return (
    <Card className="p-0 border-0 shadow-none">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {(error as any)?.message || "Failed to load staff"}
          </AlertDescription>
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={staffRows}
        isLoading={isLoading}
        emptyMessage="No staff found."
        loadingMessage="Loading staff..."
        showPagination={true}
      />
    </Card>
  );
}
