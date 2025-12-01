import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field";
import { useAddNote, useAddLog, useAddTask } from "@workspace/orpc-client";
import {
  CreateLeadNoteInputType,
  CreateLeadLogInputType,
  CreateLeadTaskInputType,
  createLeadNoteSchema,
  createLeadLogSchema,
  createLeadTaskSchema,
} from "@workspace/orpc-contract";
import { toast } from "sonner";
import { z } from "zod";

interface ActionDialogProps {
  leadId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddNoteDialog = ({
  leadId,
  open,
  onOpenChange,
}: ActionDialogProps) => {
  const addNote = useAddNote();
  const form = useForm<CreateLeadNoteInputType>({
    resolver: zodResolver(createLeadNoteSchema),
    defaultValues: { leadId, content: "" },
  });

  const onSubmit = async (data: CreateLeadNoteInputType) => {
    try {
      await addNote.mutateAsync({
        params: { leadId },
        body: { content: data.content },
      });
      toast.success("Note added successfully");
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to add note");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>Add a note to this lead.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Content</FieldLabel>
            <Textarea
              {...form.register("content")}
              placeholder="Enter note content..."
            />
            <FieldError errors={[form.formState.errors.content]} />
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addNote.isPending}>
              Add Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddLogDialog = ({
  leadId,
  open,
  onOpenChange,
}: ActionDialogProps) => {
  const addLog = useAddLog();
  const form = useForm<CreateLeadLogInputType>({
    resolver: zodResolver(createLeadLogSchema),
    defaultValues: { leadId, type: "CALL", message: "" },
  });

  const onSubmit = async (data: CreateLeadLogInputType) => {
    try {
      await addLog.mutateAsync({
        params: { leadId },
        body: {
          type: data.type,
          message: data.message,
          nextAction: data.nextAction,
        },
      });
      toast.success("Log added successfully");
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to add log");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
          <DialogDescription>Log a call, email, or meeting.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select
              onValueChange={(val) => form.setValue("type", val as any)}
              defaultValue={form.getValues("type")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CALL">Call</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="MEETING">Meeting</SelectItem>
                <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[form.formState.errors.type]} />
          </Field>
          <Field>
            <FieldLabel>Message</FieldLabel>
            <Textarea
              {...form.register("message")}
              placeholder="Enter details..."
            />
            <FieldError errors={[form.formState.errors.message]} />
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addLog.isPending}>
              Save Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddTaskDialog = ({
  leadId,
  open,
  onOpenChange,
}: ActionDialogProps) => {
  const addTask = useAddTask();
  const form = useForm<CreateLeadTaskInputType>({
    resolver: zodResolver(createLeadTaskSchema),
    defaultValues: { leadId, title: "" },
  });

  const onSubmit = async (data: CreateLeadTaskInputType) => {
    try {
      await addTask.mutateAsync({
        params: { leadId },
        body: {
          title: data.title,
          dueDate: data.dueDate,
          assignedTo: data.assignedTo,
        },
      });
      toast.success("Task added successfully");
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to add task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Create a new task for this lead.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input {...form.register("title")} placeholder="Task title" />
            <FieldError errors={[form.formState.errors.title]} />
          </Field>
          <Field>
            <FieldLabel>Due Date</FieldLabel>
            <Input type="datetime-local" {...form.register("dueDate")} />
            <FieldError errors={[form.formState.errors.dueDate]} />
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addTask.isPending}>
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
