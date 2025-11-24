import { z } from "zod";

export const PermissionOutput = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});
