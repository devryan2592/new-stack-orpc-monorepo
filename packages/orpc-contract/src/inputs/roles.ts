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
  roleId: z.string(),
});
