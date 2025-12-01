import { prisma } from "@workspace/db";
import { ORPCError } from "@orpc/server";
import {
  CreateRoleInput,
  UpdateRoleInput,
  AssignRoleInput,
  DeleteRoleInput,
  RoleOutput,
  ListRolesOutput,
} from "./types";

export const rolesServiceFactory = (db: typeof prisma) => {
  const ensureAdmin = async (userId: string) => {
    const userRole = await db.userRole.findFirst({
      where: {
        userId,
        role: {
          name: { in: ["superadmin", "admin"] },
        },
      },
    });
    if (!userRole) {
      throw new ORPCError("FORBIDDEN", { message: "Admin access required" });
    }
  };

  async function createRole(
    requesterId: string,
    input: CreateRoleInput
  ): Promise<RoleOutput> {
    await ensureAdmin(requesterId);
    const { permissions, ...data } = input.body;
    return db.role.create({
      data: {
        ...data,
        rolePerms: permissions
          ? {
              create: permissions.map((id) => ({ permissionId: id })),
            }
          : undefined,
      },
    });
  }

  async function listRoles(requesterId: string): Promise<ListRolesOutput> {
    await ensureAdmin(requesterId);
    return db.role.findMany({
      include: {
        rolePerms: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async function updateRole(
    requesterId: string,
    input: UpdateRoleInput
  ): Promise<RoleOutput> {
    await ensureAdmin(requesterId);
    const { id } = input.params;
    const { permissions, ...data } = input.body;

    return db.role.update({
      where: { id },
      data: {
        ...data,
        rolePerms: permissions
          ? {
              deleteMany: {},
              create: permissions.map((pid) => ({ permissionId: pid })),
            }
          : undefined,
      },
    });
  }

  async function deleteRole(
    requesterId: string,
    input: DeleteRoleInput
  ): Promise<{ success: boolean }> {
    await ensureAdmin(requesterId);
    await db.role.delete({ where: { id: input.params.id } });
    return { success: true };
  }

  async function assignRole(
    requesterId: string,
    input: AssignRoleInput
  ): Promise<{ success: boolean }> {
    await ensureAdmin(requesterId);
    const { userId, roleIds } = input.body;

    // Sync roles: Delete existing and create new
    await db.userRole.deleteMany({
      where: { userId },
    });

    if (roleIds.length > 0) {
      await db.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId,
          roleId,
        })),
      });
    }

    return { success: true };
  }

  return {
    createRole,
    listRoles,
    updateRole,
    deleteRole,
    assignRole,
  };
};

export const rolesService = rolesServiceFactory(prisma);
