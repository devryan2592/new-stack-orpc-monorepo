import { z } from "zod";

export const CreateLeadInput = z.object({
  customerId: z.string().optional(),
  assignedToId: z.string().optional(),
  leadType: z.enum(["B2C", "B2B_CORPORATE", "B2B_AGENCY"]),
  leadSource: z.enum([
    "WEBSITE",
    "REFERRAL",
    "SOCIAL_MEDIA",
    "CAMPAIGN",
    "OTHER",
  ]),
  status: z
    .enum(["NEW", "FOLLOW_UP", "POTENTIAL", "POSITIVE", "CONVERTED", "CLOSED"])
    .default("NEW"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  travelFrom: z.string().optional(),
  travelTo: z.string().optional(),
  travelStart: z.string().datetime().optional(),
  travelEnd: z.string().datetime().optional(),
  numberOfDays: z.number().int().optional(),
  numberOfTravellers: z.number().int().optional(),

  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
});

export const UpdateLeadInput = CreateLeadInput.partial().extend({
  id: z.string(),
});

export const ListLeadsInput = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z
    .enum(["NEW", "FOLLOW_UP", "POTENTIAL", "POSITIVE", "CONVERTED", "CLOSED"])
    .optional(),
  customerId: z.string().optional(),
});

export const ConvertLeadInput = z.object({
  leadId: z.string(),
});

export type CreateLeadInputType = z.input<typeof CreateLeadInput>;
export type UpdateLeadInputType = z.input<typeof UpdateLeadInput>;
export type ListLeadsInputType = z.input<typeof ListLeadsInput>;
export type ConvertLeadInputType = z.input<typeof ConvertLeadInput>;
