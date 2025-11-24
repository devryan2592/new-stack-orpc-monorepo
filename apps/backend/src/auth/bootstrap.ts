import { prisma } from "@workspace/db";
import { AuthType } from "./auth";

// We will initialize the auth with bootstrap (to check for super user and return the auth instance)
const bootstrapSuperAdmin = async (auth: AuthType) => {
  const existingAdmin = await prisma.userRole.findFirst({
    where: {
      role: {
        name: {
          in: ["superadmin", "admin"],
        },
      },
    },
  });

  if (existingAdmin) return;

  const email = process.env.SUPERADMIN_EMAIL ?? "superadmin@example.com";
  const password = process.env.SUPERADMIN_PASSWORD ?? "ChangeMe123!";

  // Create Super Administrator
  const user = await auth.api.signUpEmail({
    body: {
      name: "Super Administrator",
      email,
      password,
    },
  });

  // Create Super Administrator Role
  const role = await prisma.role.create({
    data: {
      name: "superadmin",
      label: "Super Administrator",
      description: "Full system access.",
    },
  });

  // Assign Super Administrator Role to the user
  await prisma.userRole.create({
    data: {
      userId: user.user.id,
      roleId: role.id,
    },
  });

  console.log("Super Administrator created:", user);
};

const bootstrapPermissions = async (features: string[]) => {
  const actions = ["create", "read", "update", "delete"];
  const permissions: string[] = [];

  for (const feature of features) {
    for (const action of actions) {
      permissions.push(`${feature}:${action}`);
    }
  }

  // Create Permissions
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: {
        name: permission,
        description: `Permission to ${permission.split(":")[1]} ${
          permission.split(":")[0]
        }`,
      },
    });
  }

  // Assign all permissions to superadmin and admin
  const adminRoles = await prisma.role.findMany({
    where: { name: { in: ["superadmin", "admin"] } },
  });

  const allPermissions = await prisma.permission.findMany();

  for (const role of adminRoles) {
    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log("Permissions bootstrapped successfully.");
};

export { bootstrapSuperAdmin, bootstrapPermissions };
