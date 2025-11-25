import { z } from "zod";

export const CreateRoleInputSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const UpdateRoleInputSchema = z.object({
  name: z.string().min(1).optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const AssignRoleInputSchema = z.object({
  userId: z.string(),
  roleIds: z.array(z.string()),
});

export type CreateRoleInputType = z.input<typeof CreateRoleInputSchema>;
export type UpdateRoleInputType = z.input<typeof UpdateRoleInputSchema>;
export type AssignRoleInputType = z.input<typeof AssignRoleInputSchema>;
