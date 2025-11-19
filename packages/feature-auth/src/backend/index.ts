import { prisma } from "@shared/db";
import { createAuth } from "./auth";

export const auth = createAuth({
  prisma: prisma,
  baseURL: "http://localhost:8000",
  basePath: "/api/v1/auth",
  trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
});

export * from "./auth";
