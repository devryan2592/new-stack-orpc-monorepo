import { z } from "zod";
import { LeadLogType, LeadTaskStatus } from "../shared";

export const createLeadNoteSchema = z.object({
  leadId: z.string(),
  content: z.string().min(1),
});

export const updateLeadNoteSchema = createLeadNoteSchema.partial();

export const createLeadLogSchema = z.object({
  leadId: z.string(),
  type: LeadLogType,
  message: z.string().optional(),
  nextAction: z.string().datetime().optional(),
});

export const updateLeadLogSchema = createLeadLogSchema.partial();

export const createLeadTaskSchema = z.object({
  leadId: z.string(),
  title: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().optional(),
});

export const updateLeadTaskSchema = createLeadTaskSchema.partial();

export const bulkDeleteLeadsSchema = z.object({
  ids: z.array(z.string()),
});

export const bulkConvertLeadsSchema = z.object({
  ids: z.array(z.string()),
});

export type CreateLeadNoteInputType = z.input<typeof createLeadNoteSchema>;
export type UpdateLeadNoteInputType = z.input<typeof updateLeadNoteSchema>;
export type CreateLeadLogInputType = z.input<typeof createLeadLogSchema>;
export type UpdateLeadLogInputType = z.input<typeof updateLeadLogSchema>;
export type CreateLeadTaskInputType = z.input<typeof createLeadTaskSchema>;
export type UpdateLeadTaskInputType = z.input<typeof updateLeadTaskSchema>;
export type BulkDeleteLeadsInputType = z.input<typeof bulkDeleteLeadsSchema>;
export type BulkConvertLeadsInputType = z.input<typeof bulkConvertLeadsSchema>;
