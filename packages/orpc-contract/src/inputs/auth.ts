import { z } from "zod";

export const paginationInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const roleCreateInput = z.object({
  name: z.string().min(2).max(64),
  label: z.string().min(1).max(128).optional(),
  description: z.string().min(1).max(256).optional(),
});

export const roleUpdateInput = z.object({
  id: z.string(),
  label: z.string().min(1).max(128).optional(),
  description: z.string().min(1).max(256).optional(),
});

export const roleDeleteInput = z.object({ id: z.string() });
export const roleGetInput = z.object({ id: z.string() });
export const roleListInput = paginationInput;

export const permissionCreateInput = z.object({
  name: z.string().min(2).max(128),
  label: z.string().min(1).max(128).optional(),
  description: z.string().min(1).max(256).optional(),
});

export const permissionUpdateInput = z.object({
  id: z.string(),
  label: z.string().min(1).max(128).optional(),
  description: z.string().min(1).max(256).optional(),
});

export const permissionDeleteInput = z.object({ id: z.string() });
export const permissionGetInput = z.object({ id: z.string() });
export const permissionListInput = paginationInput;

export const roleAssignInput = z.object({ userId: z.string(), roleId: z.string() });
export const roleRemoveInput = z.object({ userId: z.string(), roleId: z.string() });
export const userRolesListInput = z.object({ userId: z.string() }).merge(paginationInput.partial());
export const rolePermissionsSetInput = z.object({ roleId: z.string(), permissionIds: z.array(z.string()).max(100) });
export const rolePermissionsListInput = z.object({ roleId: z.string() }).merge(paginationInput.partial());

export const statusCode = z.enum([
  "OK",
  "BAD_REQUEST",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "INTERNAL_SERVER_ERROR",
]);