import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  FileText,
  Phone,
  CheckSquare,
} from "lucide-react";
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
import { LeadSheetForm } from "../_forms/lead-sheet-form";
import {
  AddLogDialog,
  AddNoteDialog,
  AddTaskDialog,
} from "../_components/action-dialogs";
import { useDeleteLead, useLead } from "@workspace/orpc-client";
import { toast } from "sonner";
import { LeadOutputSchema } from "@workspace/orpc-contract";
import { z } from "zod";

interface LeadsTableActionsProps {
  lead: z.infer<typeof LeadOutputSchema>;
}

export const LeadsTableActions = ({ lead }: LeadsTableActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  const deleteLead = useDeleteLead();

  const handleDelete = async () => {
    try {
      await deleteLead.mutateAsync({ params: { id: lead.id } });
      toast.success("Lead deleted successfully");
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete lead");
    }
  };

  return (
    <>
      <LeadSheetForm
        lead={lead}
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
      />

      <AddNoteDialog
        leadId={lead.id}
        open={showNoteDialog}
        onOpenChange={setShowNoteDialog}
      />
      <AddLogDialog
        leadId={lead.id}
        open={showLogDialog}
        onOpenChange={setShowLogDialog}
      />
      <AddTaskDialog
        leadId={lead.id}
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lead.
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
            onClick={() => navigator.clipboard.writeText(lead.id)}
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
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowNoteDialog(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Add Note
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowLogDialog(true)}>
            <Phone className="mr-2 h-4 w-4" />
            Log Activity
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTaskDialog(true)}>
            <CheckSquare className="mr-2 h-4 w-4" />
            Add Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
