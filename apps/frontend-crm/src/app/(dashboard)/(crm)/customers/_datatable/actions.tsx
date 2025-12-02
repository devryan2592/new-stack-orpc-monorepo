import { useState } from "react";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { AppButton } from "@workspace/ui/custom/app-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { CustomerSheetForm } from "../_forms/customer-sheet-form";
import { useDeleteCustomer } from "@workspace/orpc-client";
import { toast } from "sonner";
import { CustomerOutputSchema } from "@workspace/orpc-contract";
import { z } from "zod";

interface CustomersTableActionsProps {
  customer: z.infer<typeof CustomerOutputSchema>;
}

export const CustomersTableActions = ({
  customer,
}: CustomersTableActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const deleteCustomer = useDeleteCustomer();

  const handleDelete = async () => {
    try {
      await deleteCustomer.mutateAsync({ params: { id: customer.id } });
      toast.success("Customer deleted successfully");
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete customer");
    }
  };

  return (
    <>
      <CustomerSheetForm
        customer={customer}
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AppButton variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </AppButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(customer.id)}
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditSheet(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
