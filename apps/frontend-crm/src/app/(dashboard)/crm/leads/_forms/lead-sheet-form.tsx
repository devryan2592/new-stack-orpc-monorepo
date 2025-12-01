import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { LeadForm } from "./lead-form";
import { useLeadForm } from "../_form-hooks/use-lead-form";
import { useCreateLead, useUpdateLead } from "@workspace/orpc-client";
import {
  CreateLeadInput,
  UpdateLeadInput,
  LeadOutput,
} from "@workspace/orpc-contract";
import { toast } from "sonner";

interface LeadSheetFormProps {
  children?: React.ReactNode;
  lead?: LeadOutput;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const LeadSheetForm = ({
  children,
  lead,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: LeadSheetFormProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const mode = lead ? "edit" : "create";
  const { form } = useLeadForm({ mode, initialData: lead });

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const onSubmit = async (data: CreateLeadInput | UpdateLeadInput) => {
    const cleanData = {
      ...data,
      tags: data.tags?.map((t: string) => t.trim()).filter(Boolean) || [],
      destinations: data.destinations || [],
      cities: data.cities || [],
    };
    try {
      if (mode === "create") {
        await createLead.mutateAsync({ body: cleanData as CreateLeadInput });
        toast.success("Lead created successfully");
      } else {
        if (!lead?.id) return;
        await updateLead.mutateAsync({
          params: { id: lead.id },
          body: cleanData as UpdateLeadInput,
        });
        toast.success("Lead updated successfully");
      }
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="overflow-y-auto w-full sm:max-w-3/4 lg:max-w-2/3 xl:max-w-1/2 transition-all duration-300 gap-0">
        <SheetHeader>
          <SheetTitle>
            {mode === "create" ? "Create Lead" : "Edit Lead"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new lead to your CRM."
              : "Update the details of this lead."}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-0 m-4 p-4 border">
          <LeadForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={createLead.isPending || updateLead.isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
