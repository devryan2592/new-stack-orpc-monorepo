import { z } from "zod";

export const CustomerOutput = z.object({
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
  type: z.enum(["INDIVIDUAL", "CORPORATE"]),
  companyName: z.string().nullable(),
  gstNumber: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
