import { z } from "zod";

export const CreateRoleInput = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const UpdateRoleInput = z.object({
  name: z.string().min(1).optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const AssignRoleInput = z.object({
  userId: z.string(),
  roleIds: z.array(z.string()),
});

export type CreateRoleInputType = z.input<typeof CreateRoleInput>;
export type UpdateRoleInputType = z.input<typeof UpdateRoleInput>;
export type AssignRoleInputType = z.input<typeof AssignRoleInput>;
