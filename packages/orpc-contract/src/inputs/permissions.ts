import { z } from "zod";

export const UpdateUserPermissionsInput = z.object({
  userId: z.string(),
  permissions: z.array(z.string()),
});
