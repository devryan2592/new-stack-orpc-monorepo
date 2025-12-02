"use client";

import { ColumnDef } from "@workspace/ui/data-table";
import { StaffTableActions } from "./actions";
import { Badge } from "@workspace/ui/components/badge";
import { UserOutputSchema } from "@workspace/orpc-contract";
import { z } from "zod";

export type StaffRow = z.infer<typeof UserOutputSchema>;

export const columns: ColumnDef<StaffRow>[] = [
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
    cell: ({ row }) => <StaffTableActions user={row.original} />,
  },
];
