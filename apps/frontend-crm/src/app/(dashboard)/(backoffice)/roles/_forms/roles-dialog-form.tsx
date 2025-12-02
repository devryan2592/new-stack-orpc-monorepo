"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { RoleForm } from "./role-form";
import { toast } from "sonner";

interface RolesDialogFormProps {
  children: React.ReactNode;
}

export function RolesDialogForm({ children }: RolesDialogFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define a new role and assign permissions.
          </DialogDescription>
        </DialogHeader>
        <RoleForm
          onSuccess={() => {
            setOpen(false);
            toast.success("Role created successfully");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
