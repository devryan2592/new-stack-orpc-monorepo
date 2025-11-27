import { z } from "zod";
import { CustomerOutput } from "./customers";

export const LeadOutput = z.object({
  id: z.string(),
  leadCode: z.string(),
  customerId: z.string().nullable(),
  assignedToId: z.string().nullable(),
  leadType: z.enum(["B2C", "B2B_CORPORATE", "B2B_AGENCY"]),
  leadSource: z.enum([
    "WEBSITE",
    "REFERRAL",
    "SOCIAL_MEDIA",
    "CAMPAIGN",
    "OTHER",
  ]),
  status: z.enum([
    "NEW",
    "FOLLOW_UP",
    "POTENTIAL",
    "POSITIVE",
    "CONVERTED",
    "CLOSED",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable(),

  travelFrom: z.string().nullable(),
  travelTo: z.string().nullable(),
  travelStart: z.date().nullable(),
  travelEnd: z.date().nullable(),
  numberOfDays: z.number().nullable(),
  numberOfTravellers: z.number().nullable(),

  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),

  customer: CustomerOutput.nullable().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
