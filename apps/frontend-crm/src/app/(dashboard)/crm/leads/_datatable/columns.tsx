import { ColumnDef } from "@workspace/ui/data-table";
import { LeadOutput } from "@workspace/orpc-contract";
import { z } from "zod";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { LeadsTableActions } from "./actions";
import { format } from "date-fns";

export type LeadRow = z.infer<typeof LeadOutput>;

export const columns: ColumnDef<LeadRow>[] = [
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
        <span className="text-xs text-muted-foreground">
          {row.original.leadCode}
        </span>
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "outline";

      switch (status) {
        case "NEW":
          variant = "default";
          break;
        case "FOLLOW_UP":
          variant = "secondary";
          break;
        case "POTENTIAL":
          variant = "secondary";
          break;
        case "POSITIVE":
          variant = "default"; // or success if available
          break;
        case "CONVERTED":
          variant = "outline"; // success
          break;
        case "CLOSED":
          variant = "destructive";
          break;
      }

      return <Badge variant={variant}>{status.replace("_", " ")}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.original.priority;
      if (!priority) return "-";

      let variant: "default" | "secondary" | "destructive" | "outline" =
        "outline";
      switch (priority) {
        case "HIGH":
          variant = "destructive";
          break;
        case "MEDIUM":
          variant = "secondary";
          break;
        case "LOW":
          variant = "outline";
          break;
      }

      return <Badge variant={variant}>{priority}</Badge>;
    },
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
    cell: ({ row }) => <LeadsTableActions lead={row.original} />,
  },
];
