import { privateProcedure } from "@/config/orpc";
import { prisma } from "@workspace/db";
import { ORPCError } from "@orpc/server";

const isAdmin = async (userId: string) => {
  const userRole = await prisma.userRole.findFirst({
    where: {
      userId,
      role: {
        name: { in: ["superadmin", "admin"] },
      },
    },
  });
  return !!userRole;
};

const ensureAdmin = async (userId: string) => {
  if (!(await isAdmin(userId))) {
    throw new ORPCError("FORBIDDEN", { message: "Admin access required" });
  }
};

const createRole = privateProcedure.roles.create.handler(
  async ({ input, context }) => {
    await ensureAdmin(context.user.id);
    const { permissions, ...data } = input.body;
    return prisma.role.create({
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
);

const listRoles = privateProcedure.roles.list.handler(async ({ context }) => {
  await ensureAdmin(context.user.id);
  return prisma.role.findMany({
    include: {
      rolePerms: {
        include: {
          permission: true,
        },
      },
    },
  });
});

const updateRole = privateProcedure.roles.update.handler(
  async ({ input, context }) => {
    await ensureAdmin(context.user.id);
    const { id } = input.params;
    const { permissions, ...data } = input.body;

    return prisma.role.update({
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
);

const deleteRole = privateProcedure.roles.delete.handler(
  async ({ input, context }) => {
    await ensureAdmin(context.user.id);
    await prisma.role.delete({ where: { id: input.params.id } });
    return { success: true };
  }
);

const assignRole = privateProcedure.roles.assign.handler(
  async ({ input, context }) => {
    await ensureAdmin(context.user.id);
    await prisma.userRole.create({
      data: {
        userId: input.body.userId,
        roleId: input.body.roleId,
      },
    });
    return { success: true };
  }
);
export const rolesRouter = {
  create: createRole,
  list: listRoles,
  update: updateRole,
  delete: deleteRole,
  assign: assignRole,
};
