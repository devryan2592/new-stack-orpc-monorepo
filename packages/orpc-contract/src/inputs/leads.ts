import { z } from "zod";
import { LeadType, LeadSource, LeadStatus, LeadPriority } from "../shared";

export const CreateLeadInputSchema = z.object({
  leadType: LeadType,
  leadSource: LeadSource,
  status: LeadStatus.default("NEW"),
  priority: LeadPriority.optional(),

  travelFrom: z.string().optional(),
  travelTo: z.string().optional(),
  travelStart: z.string().datetime().optional(),
  travelEnd: z.string().datetime().optional(),
  numberOfDays: z.number().int().optional(),
  numberOfAdults: z.number().int().optional(),
  numberOfChildren: z.number().int().optional(),
  numberOfInfants: z.number().int().optional(),
  tags: z.array(z.string()).optional(),

  destinations: z.array(z.string()).optional(),
  cities: z.array(z.string()).optional(),
  companyName: z.string().optional(),
  whatsappNumber: z.string().optional(),
  requirements: z.string().optional(),
  budget: z.number().optional(),

  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),

  // Relationships
  customerId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const UpdateLeadInputSchema = CreateLeadInputSchema.partial();

export const ListLeadsInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: LeadStatus.optional(),
  customerId: z.string().optional(),
});

export const ConvertLeadInputSchema = z.object({
  leadId: z.string(),
});

export type CreateLeadInputType = z.input<typeof CreateLeadInputSchema>;
export type UpdateLeadInputType = z.input<typeof UpdateLeadInputSchema>;
export type ListLeadsInputType = z.input<typeof ListLeadsInputSchema>;
export type ConvertLeadInputType = z.input<typeof ConvertLeadInputSchema>;
