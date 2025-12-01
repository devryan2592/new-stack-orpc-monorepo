import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  altPhone: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
});

export type UpdateProfileInputType = z.input<typeof updateProfileSchema>;
