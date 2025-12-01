import { z } from "zod";
import { LeadLogType, LeadTaskStatus } from "../shared";

export const LeadNoteOutputSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  content: z.string(),
  createdBy: z.string(),
  createdAt: z.date(),
});

export const LeadLogOutputSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  type: LeadLogType,
  message: z.string().nullable(),
  nextAction: z.date().nullable(),
  loggedBy: z.string(),
  createdAt: z.date(),
});

export const LeadTaskOutputSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  title: z.string(),
  dueDate: z.date().nullable(),
  status: LeadTaskStatus,
  assignedTo: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type LeadNoteOutputType = z.infer<typeof LeadNoteOutputSchema>;
export type LeadLogOutputType = z.infer<typeof LeadLogOutputSchema>;
export type LeadTaskOutputType = z.infer<typeof LeadTaskOutputSchema>;
