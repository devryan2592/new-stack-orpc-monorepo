import { z } from "zod";

export const RoleOutput = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
