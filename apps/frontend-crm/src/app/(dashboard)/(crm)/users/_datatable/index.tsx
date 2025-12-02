"use client";

import { useMemo } from "react";
import { Card } from "@workspace/ui/components/card";
import { DataTable } from "@workspace/ui/data-table";
import { useUsers } from "@workspace/orpc-client";
import { columns, UserRow } from "./columns";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { AlertCircle } from "lucide-react";

export function UsersDataTable() {
  const {
    data: users,
    isLoading,
    error,
  } = useUsers({
    roles: ["none", "user"],
  });

  const userRows: UserRow[] = useMemo(
    () => (users?.data?.users ?? []) as UserRow[],
    [users]
  );

  return (
    <Card className="p-0 border-0 shadow-none">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {(error as any)?.message || "Failed to load users"}
          </AlertDescription>
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={userRows}
        isLoading={isLoading}
        emptyMessage="No users found."
        loadingMessage="Loading users..."
        showPagination={true}
      />
    </Card>
  );
}
