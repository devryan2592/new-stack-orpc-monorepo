import { prisma } from "@workspace/db";

export type PermissionCheck = {
  required: string | string[];
};

export async function resolveUserPermissions(userId: string): Promise<Set<string>> {
  const roles = await prisma.userRole.findMany({
    where: { userId },
    select: { roleId: true },
  });
  if (roles.length === 0) return new Set<string>();
  const roleIds = roles.map((r) => r.roleId);
  const perms = await prisma.rolePermission.findMany({
    where: { roleId: { in: roleIds } },
    select: { permission: { select: { name: true } } },
  });
  const names = perms.map((p) => p.permission.name);
  return new Set(names);
}

export function hasPermission(set: Set<string>, required: string | string[]) {
  if (Array.isArray(required)) {
    return required.every((r) => set.has(r));
  }
  return set.has(required);
}

export async function requirePermission(userId: string | null | undefined, required: string | string[]) {
  if (!userId) {
    return { ok: false, code: "UNAUTHORIZED" as const };
  }
  const userPerms = await resolveUserPermissions(userId);
  if (!hasPermission(userPerms, required)) {
    return { ok: false, code: "FORBIDDEN" as const };
  }
  return { ok: true as const };
}