import { z } from "zod";

export const RoleOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  rolePerms: z.array(z.object({ permissionId: z.string() })).optional(),
});

export type RoleOutputType = z.infer<typeof RoleOutputSchema>;
