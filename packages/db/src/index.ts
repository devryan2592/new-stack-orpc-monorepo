import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// Use globalThis to access process safely
const nodeProcess = (globalThis as any).process;
if (nodeProcess && nodeProcess.env?.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
export { PrismaClient };
