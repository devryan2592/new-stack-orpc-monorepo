"use client";

import { useMemo } from "react";
import { Card } from "@workspace/ui/components/card";
import { DataTable } from "@workspace/ui/data-table";
import { useRoles } from "@workspace/orpc-client";
import { columns, RoleRow } from "./columns";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { AlertCircle } from "lucide-react";

export function RolesDataTable() {
  const { data: roles, isLoading, error } = useRoles();

  const roleRows: RoleRow[] = useMemo(
    () => (roles ?? []) as RoleRow[],
    [roles]
  );

  return (
    <Card className="p-0 border-0 shadow-none">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {(error as any)?.message || "Failed to load roles"}
          </AlertDescription>
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={roleRows}
        isLoading={isLoading}
        emptyMessage="No roles found."
        loadingMessage="Loading roles..."
        showPagination={true}
      />
    </Card>
  );
}
