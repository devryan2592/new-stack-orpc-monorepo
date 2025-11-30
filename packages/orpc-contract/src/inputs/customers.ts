import { z } from "zod";
import { CustomerType } from "../shared";

export const CreateCustomerInputSchema = z.object({
  avatar: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  alternatePhone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(), // Accepting ISO string for date
  gender: z.string().optional(),
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().datetime().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  type: CustomerType.default("B2C"),
  companyName: z.string().optional(),
  gstNumber: z.string().optional(),
  vatNumber: z.string().optional(),

  // Relationships
  familyMemberIds: z.array(z.string()).optional(),
  associateIds: z.array(z.string()).optional(),
});

export const UpdateCustomerInputSchema = CreateCustomerInputSchema.partial();

export const ListCustomersInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

export type CreateCustomerInputType = z.input<typeof CreateCustomerInputSchema>;
export type UpdateCustomerInputType = z.input<typeof UpdateCustomerInputSchema>;
export type ListCustomersInputType = z.input<typeof ListCustomersInputSchema>;
