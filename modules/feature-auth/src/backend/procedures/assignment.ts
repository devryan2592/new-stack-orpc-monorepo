import { z } from "zod";
import { prisma } from "@workspace/db";
import { AuthInputs, AuthOutputs } from "@workspace/orpc-contract";

export async function assignRole(input: z.infer<typeof AuthInputs.roleAssignInput>): Promise<z.infer<typeof AuthOutputs.emptyOutput>> {
  const user = await prisma.user.findUnique({ where: { id: input.userId } });
  if (!user) return { status: { code: "NOT_FOUND", message: "User not found" } };
  const role = await prisma.role.findUnique({ where: { id: input.roleId } });
  if (!role) return { status: { code: "NOT_FOUND", message: "Role not found" } };
  const existing = await prisma.userRole.findUnique({ where: { userId_roleId: { userId: input.userId, roleId: input.roleId } } });
  if (existing) return { status: { code: "CONFLICT", message: "Role already assigned" } };
  await prisma.userRole.create({ data: { userId: input.userId, roleId: input.roleId } });
  return { status: { code: "OK" } };
}

export async function removeRole(input: z.infer<typeof AuthInputs.roleRemoveInput>): Promise<z.infer<typeof AuthOutputs.emptyOutput>> {
  const existing = await prisma.userRole.findUnique({ where: { userId_roleId: { userId: input.userId, roleId: input.roleId } } });
  if (!existing) return { status: { code: "NOT_FOUND", message: "Assignment not found" } };
  await prisma.userRole.delete({ where: { userId_roleId: { userId: input.userId, roleId: input.roleId } } });
  return { status: { code: "OK" } };
}

export async function listUserRoles(input: z.infer<typeof AuthInputs.userRolesListInput>): Promise<z.infer<typeof AuthOutputs.roleListOutput>> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 50;
  const total = await prisma.userRole.count({ where: { userId: input.userId } });
  const skip = (page - 1) * pageSize;
  const rows = await prisma.userRole.findMany({ where: { userId: input.userId }, skip, take: pageSize, include: { role: true } });
  const data = rows.map((r) => r.role);
  return { status: { code: "OK" }, data, meta: { page, pageSize, total } };
}

export async function setRolePermissions(input: z.infer<typeof AuthInputs.rolePermissionsSetInput>): Promise<z.infer<typeof AuthOutputs.emptyOutput>> {
  const role = await prisma.role.findUnique({ where: { id: input.roleId } });
  if (!role) return { status: { code: "NOT_FOUND", message: "Role not found" } };
  await prisma.rolePermission.deleteMany({ where: { roleId: input.roleId } });
  if (input.permissionIds.length > 0) {
    const perms = await prisma.permission.findMany({ where: { id: { in: input.permissionIds } }, select: { id: true } });
    const values = perms.map((p) => ({ roleId: input.roleId, permissionId: p.id }));
    if (values.length > 0) await prisma.rolePermission.createMany({ data: values });
  }
  return { status: { code: "OK" } };
}

export async function listRolePermissions(input: z.infer<typeof AuthInputs.rolePermissionsListInput>): Promise<z.infer<typeof AuthOutputs.permissionListOutput>> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 50;
  const total = await prisma.rolePermission.count({ where: { roleId: input.roleId } });
  const skip = (page - 1) * pageSize;
  const rows = await prisma.rolePermission.findMany({ where: { roleId: input.roleId }, skip, take: pageSize, include: { permission: true } });
  const data = rows.map((r) => r.permission);
  return { status: { code: "OK" }, data, meta: { page, pageSize, total } };
}