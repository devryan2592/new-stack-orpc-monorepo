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
import { UserForm } from "./user-form";
import { toast } from "sonner";

interface UsersDialogFormProps {
  children: React.ReactNode;
}

export function UsersDialogForm({ children }: UsersDialogFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Create a new user account.</DialogDescription>
        </DialogHeader>
        <UserForm
          onSuccess={() => {
            setOpen(false);
            toast.success("User created successfully");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
