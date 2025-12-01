import { z } from "zod";

export const updateUserPermissionsSchema = z.object({
  userId: z.string(),
  permissions: z.array(z.string()),
});

export type UpdateUserPermissionsInputType = z.input<
  typeof updateUserPermissionsSchema
>;
