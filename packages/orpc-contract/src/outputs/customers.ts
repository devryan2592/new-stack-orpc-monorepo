import { z } from "zod";
import { CustomerType } from "../shared";

const BaseCustomerOutputSchema = z.object({
  id: z.string(),
  avatar: z.string().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  alternatePhone: z.string().nullable(),
  dateOfBirth: z.date().nullable(),
  gender: z.string().nullable(),
  nationality: z.string().nullable(),
  passportNumber: z.string().nullable(),
  passportExpiry: z.date().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  type: CustomerType,
  companyName: z.string().nullable(),
  gstNumber: z.string().nullable(),
  vatNumber: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const RelatedCustomerOutputSchema = BaseCustomerOutputSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
});

export const CustomerOutputSchema = BaseCustomerOutputSchema.extend({
  familyMembers: RelatedCustomerOutputSchema.array().optional(),
  associates: RelatedCustomerOutputSchema.array().optional(),
});

export type CustomerOutputType = z.infer<typeof CustomerOutputSchema>;
