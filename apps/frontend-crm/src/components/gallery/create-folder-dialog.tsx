"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useCreateFolder } from "@workspace/orpc-client";
import { toast } from "sonner";

const CreateFolderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(255, "Folder name is too long"),
});

type CreateFolderFormInput = z.infer<typeof CreateFolderSchema>;

interface CreateFolderDialogProps {
  currentFolderId?: string;
  children: React.ReactNode;
}

export function CreateFolderDialog({
  currentFolderId,
  children,
}: CreateFolderDialogProps) {
  const [open, setOpen] = useState(false);
  const createFolder = useCreateFolder();

  const form = useForm<CreateFolderFormInput>({
    resolver: zodResolver(CreateFolderSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    formState: { isSubmitting, errors },
    reset,
  } = form;

  const onSubmit = async (data: CreateFolderFormInput) => {
    try {
      await createFolder.mutateAsync({
        body: { name: data.name, parentId: currentFolderId },
      });
      toast.success("Folder created successfully");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create folder");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Folder Name</FieldLabel>
              <Input
                id="name"
                placeholder="My Folder"
                disabled={isSubmitting}
                {...form.register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
