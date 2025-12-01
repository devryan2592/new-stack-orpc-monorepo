import { z } from "zod";

export const PermissionOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export type PermissionOutputType = z.infer<typeof PermissionOutputSchema>;
