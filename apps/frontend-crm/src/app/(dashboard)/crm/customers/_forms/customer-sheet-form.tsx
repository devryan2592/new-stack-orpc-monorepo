import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { CustomerForm } from "./customer-form";
import { useCustomerForm } from "../_form-hooks/use-customer-form";
import { useCreateCustomer, useUpdateCustomer } from "@workspace/orpc-client";
import {
  CreateCustomerInputType,
  CustomerOutputSchema,
} from "@workspace/orpc-contract";
import { z } from "zod";
import { toast } from "sonner";

interface CustomerSheetFormProps {
  children?: React.ReactNode;
  customer?: z.infer<typeof CustomerOutputSchema>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CustomerSheetForm = ({
  children,
  customer,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: CustomerSheetFormProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const mode = customer ? "edit" : "create";
  const { form } = useCustomerForm({ mode, initialData: customer });

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const onSubmit = async (data: CreateCustomerInputType) => {
    try {
      if (mode === "create") {
        await createCustomer.mutateAsync({ body: data });
        toast.success("Customer created successfully");
      } else {
        if (!customer?.id) return;
        await updateCustomer.mutateAsync({
          params: { id: customer.id },
          body: data,
        });
        toast.success("Customer updated successfully");
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
            {mode === "create" ? "Create Customer" : "Edit Customer"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new customer to your CRM."
              : "Update the details of this customer."}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-0 m-4 p-4 border">
          <CustomerForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={createCustomer.isPending || updateCustomer.isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
