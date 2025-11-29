"use client";

import { ColumnDef } from "@workspace/ui/data-table";
import { RolesTableActions } from "./actions";

export type RoleRow = {
  id: string;
  name: string;
  label?: string | null;
  description?: string | null;
  rolePerms?: { permissionId: string }[];
};

export const columns: ColumnDef<RoleRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => <span>{row.original.label || "-"}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground truncate max-w-[300px] block">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <RolesTableActions role={row.original} />,
  },
];
