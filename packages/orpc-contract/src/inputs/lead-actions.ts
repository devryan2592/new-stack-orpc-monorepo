import { z } from "zod";
import { LeadLogType, LeadTaskStatus } from "../shared";

export const CreateLeadNoteInputSchema = z.object({
  leadId: z.string(),
  content: z.string().min(1),
});

export const CreateLeadLogInputSchema = z.object({
  leadId: z.string(),
  type: LeadLogType,
  message: z.string().optional(),
  nextAction: z.string().datetime().optional(),
});

export const CreateLeadTaskInputSchema = z.object({
  leadId: z.string(),
  title: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().optional(),
});

export const UpdateLeadTaskInputSchema = CreateLeadTaskInputSchema.extend({
  id: z.string(),
});

export const BulkDeleteLeadsInputSchema = z.object({
  ids: z.array(z.string()),
});

export const BulkConvertLeadsInputSchema = z.object({
  ids: z.array(z.string()),
});

export type CreateLeadNoteInputType = z.input<typeof CreateLeadNoteInputSchema>;
export type CreateLeadLogInputType = z.input<typeof CreateLeadLogInputSchema>;
export type CreateLeadTaskInputType = z.input<typeof CreateLeadTaskInputSchema>;
export type UpdateLeadTaskInputType = z.input<typeof UpdateLeadTaskInputSchema>;
export type BulkDeleteLeadsInputType = z.input<
  typeof BulkDeleteLeadsInputSchema
>;
export type BulkConvertLeadsInputType = z.input<
  typeof BulkConvertLeadsInputSchema
>;
