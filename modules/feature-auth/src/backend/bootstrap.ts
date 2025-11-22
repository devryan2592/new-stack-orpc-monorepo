import { prisma } from "@workspace/db";
import { Auth, BetterAuthOptions } from "better-auth";

// We will initialize the auth with bootstrap (to check for super user and return the auth instance)
const bootstrapSuperAdmin = async (auth: Auth<BetterAuthOptions>) => {
  const users = await prisma.user.count();
  if (users > 0) return;
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

export { bootstrapSuperAdmin };
