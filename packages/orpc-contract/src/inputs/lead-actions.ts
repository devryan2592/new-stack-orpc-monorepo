import { z } from "zod";
import { LeadLogType, LeadTaskStatus } from "../shared";

export const CreateLeadNoteInput = z.object({
  leadId: z.string(),
  content: z.string().min(1),
});

export const CreateLeadLogInput = z.object({
  leadId: z.string(),
  type: LeadLogType,
  message: z.string().optional(),
  nextAction: z.string().datetime().optional(),
});

export const CreateLeadTaskInput = z.object({
  leadId: z.string(),
  title: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().optional(),
});

export const UpdateLeadTaskInput = z.object({
  id: z.string(),
  title: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: LeadTaskStatus.optional(),
  assignedTo: z.string().optional(),
});

export const BulkDeleteLeadsInput = z.object({
  ids: z.array(z.string()),
});

export const BulkConvertLeadsInput = z.object({
  ids: z.array(z.string()),
});
