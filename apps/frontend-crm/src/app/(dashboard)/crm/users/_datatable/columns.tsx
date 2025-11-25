"use client";

import { ColumnDef } from "@workspace/ui/data-table";
import { UsersTableActions } from "./actions";
import { Badge } from "@workspace/ui/components/badge";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  roles?: { id: string; name: string }[];
};

export const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roles?.map((role) => (
          <Badge key={role.id} variant="outline">
            {role.name}
          </Badge>
        )) || "-"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UsersTableActions user={row.original} />,
  },
];
