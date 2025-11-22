import { z } from "zod";
import { prisma } from "@workspace/db";
import { AuthInputs, AuthOutputs } from "@workspace/orpc-contract";

export async function createPermission(input: z.infer<typeof AuthInputs.permissionCreateInput>): Promise<z.infer<typeof AuthOutputs.permissionOutput>> {
  const exists = await prisma.permission.findUnique({ where: { name: input.name } });
  if (exists) {
    return { status: { code: "CONFLICT", message: "Permission name already exists" }, data: undefined };
  }
  const permission = await prisma.permission.create({ data: input });
  return { status: { code: "OK" }, data: permission };
}

export async function updatePermission(input: z.infer<typeof AuthInputs.permissionUpdateInput>): Promise<z.infer<typeof AuthOutputs.permissionOutput>> {
  const permission = await prisma.permission.findUnique({ where: { id: input.id } });
  if (!permission) {
    return { status: { code: "NOT_FOUND", message: "Permission not found" }, data: undefined };
  }
  const updated = await prisma.permission.update({ where: { id: input.id }, data: { label: input.label, description: input.description } });
  return { status: { code: "OK" }, data: updated };
}

export async function deletePermission(input: z.infer<typeof AuthInputs.permissionDeleteInput>): Promise<z.infer<typeof AuthOutputs.emptyOutput>> {
  const permission = await prisma.permission.findUnique({ where: { id: input.id } });
  if (!permission) {
    return { status: { code: "NOT_FOUND", message: "Permission not found" } };
  }
  await prisma.permission.delete({ where: { id: input.id } });
  return { status: { code: "OK" } };
}

export async function getPermission(input: z.infer<typeof AuthInputs.permissionGetInput>): Promise<z.infer<typeof AuthOutputs.permissionOutput>> {
  const permission = await prisma.permission.findUnique({ where: { id: input.id } });
  if (!permission) return { status: { code: "NOT_FOUND" }, data: undefined };
  return { status: { code: "OK" }, data: permission };
}

export async function listPermissions(input: z.infer<typeof AuthInputs.permissionListInput>): Promise<z.infer<typeof AuthOutputs.permissionListOutput>> {
  const total = await prisma.permission.count();
  const skip = (input.page - 1) * input.pageSize;
  const data = await prisma.permission.findMany({ skip, take: input.pageSize, orderBy: { createdAt: "desc" } });
  return { status: { code: "OK" }, data, meta: { page: input.page, pageSize: input.pageSize, total } };
}