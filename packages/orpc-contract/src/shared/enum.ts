import { z } from "zod";

export const CustomerType = z.enum(["B2C", "B2B_CORPORATE", "B2B_AGENCY"]);
export type CustomerType = z.input<typeof CustomerType>;

export const FileType = z.enum(["IMAGE", "VIDEO"]);
export type FileType = z.input<typeof FileType>;

export const LeadLogType = z.enum(["CALL", "EMAIL", "MEETING", "WHATSAPP"]);
export type LeadLogType = z.input<typeof LeadLogType>;

export const LeadTaskStatus = z.enum(["PENDING", "DONE"]);
export type LeadTaskStatus = z.input<typeof LeadTaskStatus>;

export const LeadType = z.enum(["B2C", "B2B_CORPORATE", "B2B_AGENCY"]);
export type LeadType = z.input<typeof LeadType>;

export const LeadSource = z.enum([
  "WEBSITE",
  "REFERRAL",
  "SOCIAL_MEDIA",
  "CAMPAIGN",
  "OTHER",
]);
export type LeadSource = z.input<typeof LeadSource>;

export const LeadStatus = z.enum([
  "NEW",
  "FOLLOW_UP",
  "POTENTIAL",
  "POSITIVE",
  "CONVERTED",
  "CLOSED",
]);
export type LeadStatus = z.input<typeof LeadStatus>;

export const LeadPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);
export type LeadPriority = z.input<typeof LeadPriority>;
