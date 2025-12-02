"use client";

import { useMemo, useState } from "react";
import { Card } from "@workspace/ui/components/card";
import { DataTable } from "@workspace/ui/data-table";
import {
  useLeads,
  useBulkDeleteLeads,
  useBulkConvertLeads,
} from "@workspace/orpc-client";
import { columns, LeadRow } from "./columns";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { AlertCircle, Trash, UserCheck } from "lucide-react";
import { RowSelectionState } from "@workspace/ui/data-table";
import { AppButton } from "@workspace/ui/custom/app-button";
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
import { toast } from "sonner";

export function LeadsDataTable() {
  const { data: leadsData, isLoading, error } = useLeads();
  const leads = leadsData?.data?.leads ?? [];

  console.log("Data", leadsData);
  console.log("Leads", leads);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const bulkDelete = useBulkDeleteLeads();
  const bulkConvert = useBulkConvertLeads();

  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection).filter((id) => rowSelection[id]);
  }, [rowSelection]);

  // Since rowSelection keys are indices if we don't provide getRowId,
  // but usually we want IDs. DataTable uses index by default unless getRowId is passed.
  // Wait, DataTable in UI package doesn't accept getRowId prop.
  // It uses default which is index.
  // But my columns use `row.original.id` for actions.
  // If I want selection to work with IDs, I should probably map indices to IDs.

  const selectedLeadIds = useMemo(() => {
    if (!leads) return [];
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => leads[parseInt(key)]?.id)
      .filter((id): id is string => !!id);
  }, [rowSelection, leads]);

  const handleBulkDelete = async () => {
    if (!selectedLeadIds.length) return;
    try {
      await bulkDelete.mutateAsync({ body: { ids: selectedLeadIds } });
      toast.success(`${selectedLeadIds.length} leads deleted successfully`);
      setRowSelection({});
      setShowBulkDeleteDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete leads");
    }
  };

  const handleBulkConvert = async () => {
    if (!selectedLeadIds.length) return;
    try {
      await bulkConvert.mutateAsync({ body: { ids: selectedLeadIds } });
      toast.success(`${selectedLeadIds.length} leads converted successfully`);
      setRowSelection({});
    } catch (error: any) {
      toast.error(error.message || "Failed to convert leads");
    }
  };

  const roleRows: LeadRow[] = useMemo(
    () => (leads ?? []) as LeadRow[],
    [leads]
  );

  return (
    <div className="space-y-4">
      {selectedLeadIds.length > 0 && (
        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg border border-border">
          <span className="text-sm font-medium px-2">
            {selectedLeadIds.length} selected
          </span>
          <div className="flex items-center gap-2">
            <AppButton
              variant="outline"
              size="sm"
              onClick={handleBulkConvert}
              loading={bulkConvert.isPending}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Convert to Customer
            </AppButton>
            <AppButton
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDeleteDialog(true)}
              loading={bulkDelete.isPending}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </AppButton>
          </div>
        </div>
      )}

      <Card className="p-0 border-0 shadow-none">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(error as any)?.message || "Failed to load leads"}
            </AlertDescription>
          </Alert>
        )}
        <DataTable
          columns={columns}
          data={roleRows}
          isLoading={isLoading}
          emptyMessage="No leads found."
          loadingMessage="Loading leads..."
          showPagination={true}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </Card>

      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedLeadIds.length} leads.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
