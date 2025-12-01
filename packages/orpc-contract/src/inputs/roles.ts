import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1).optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const assignRoleSchema = z.object({
  userId: z.string(),
  roleIds: z.array(z.string()),
});

export type CreateRoleInputType = z.input<typeof createRoleSchema>;
export type UpdateRoleInputType = z.input<typeof updateRoleSchema>;
export type AssignRoleInputType = z.input<typeof assignRoleSchema>;
