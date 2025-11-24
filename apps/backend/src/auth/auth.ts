import { createAuth } from "@workspace/auth";

import { prisma } from "@workspace/db";

export const auth: ReturnType<typeof createAuth> = createAuth({
  prisma: prisma,
  baseURL: "http://localhost:8000",
  basePath: "/api/v1/auth",
  trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
});

export type AuthType = typeof auth;
