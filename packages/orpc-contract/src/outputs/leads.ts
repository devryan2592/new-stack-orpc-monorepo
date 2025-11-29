import { z } from "zod";
import { CustomerOutput } from "./customers";
import { LeadType, LeadSource, LeadStatus, LeadPriority } from "../shared";

export const LeadOutput = z.object({
  id: z.string(),
  leadCode: z.string(),
  customerId: z.string().nullable(),
  assignedToId: z.string().nullable(),
  leadType: LeadType,
  leadSource: LeadSource,
  status: LeadStatus,
  priority: LeadPriority.nullable(),

  travelFrom: z.string().nullable(),
  travelTo: z.string().nullable(),
  travelStart: z.date().nullable(),
  travelEnd: z.date().nullable(),
  numberOfDays: z.number().nullable(),
  numberOfAdults: z.number().nullable(),
  numberOfChildren: z.number().nullable(),
  numberOfInfants: z.number().nullable(),
  tags: z.array(z.string()),

  destinations: z.array(z.string()),
  cities: z.array(z.string()),
  companyName: z.string().nullable(),
  whatsappNumber: z.string().nullable(),
  requirements: z.string().nullable(),
  budget: z.number().nullable(),

  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),

  customer: CustomerOutput.nullable().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
