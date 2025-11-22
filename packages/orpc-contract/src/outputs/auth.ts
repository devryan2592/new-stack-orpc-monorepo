import { z } from "zod";

export const roleEntity = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const permissionEntity = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const statusOutput = z.object({
  code: z.enum([
    "OK",
    "BAD_REQUEST",
    "UNAUTHORIZED",
    "FORBIDDEN",
    "NOT_FOUND",
    "CONFLICT",
    "INTERNAL_SERVER_ERROR",
  ]),
  message: z.string().optional(),
});

export const listMeta = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
});

export const roleListOutput = z.object({
  status: statusOutput,
  data: z.array(roleEntity),
  meta: listMeta,
});

export const permissionListOutput = z.object({
  status: statusOutput,
  data: z.array(permissionEntity),
  meta: listMeta,
});

export const roleOutput = z.object({ status: statusOutput, data: roleEntity.optional() });
export const permissionOutput = z.object({ status: statusOutput, data: permissionEntity.optional() });
export const emptyOutput = z.object({ status: statusOutput });