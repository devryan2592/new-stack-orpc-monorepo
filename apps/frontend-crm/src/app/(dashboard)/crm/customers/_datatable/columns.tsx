import { ColumnDef } from "@workspace/ui/data-table";
import { CustomerOutput } from "@workspace/orpc-contract";
import { z } from "zod";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { CustomersTableActions } from "./actions";
import { format } from "date-fns";

export type CustomerRow = z.infer<typeof CustomerOutput>;

export const columns: ColumnDef<CustomerRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </span>
        {row.original.companyName && (
             <span className="text-xs text-muted-foreground">
            {row.original.companyName}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.email || "-"}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.phone || "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
        const type = row.original.type;
        return <Badge variant="outline">{type.replace("_", " ")}</Badge>;
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.createdAt), "MMM d, yyyy");
      } catch (e) {
        return "-";
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CustomersTableActions customer={row.original} />,
  },
];
