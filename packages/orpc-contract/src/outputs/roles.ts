import { z } from "zod";

export const RoleOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RoleOutputType = z.infer<typeof RoleOutputSchema>;
