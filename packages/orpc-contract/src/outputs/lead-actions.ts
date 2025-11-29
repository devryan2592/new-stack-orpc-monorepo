import { z } from "zod";
import { LeadLogType, LeadTaskStatus } from "../shared";

export const LeadNoteOutput = z.object({
  id: z.string(),
  leadId: z.string(),
  content: z.string(),
  createdBy: z.string(),
  createdAt: z.date(),
});

export const LeadLogOutput = z.object({
  id: z.string(),
  leadId: z.string(),
  type: LeadLogType,
  message: z.string().nullable(),
  nextAction: z.date().nullable(),
  loggedBy: z.string(),
  createdAt: z.date(),
});

export const LeadTaskOutput = z.object({
  id: z.string(),
  leadId: z.string(),
  title: z.string(),
  dueDate: z.date().nullable(),
  status: LeadTaskStatus,
  assignedTo: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
