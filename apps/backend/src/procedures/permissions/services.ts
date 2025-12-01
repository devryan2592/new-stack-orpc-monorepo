import { prisma } from "@workspace/db";
import { ListPermissionsOutput } from "./types";

export const permisssionServiceFactory = (db: typeof prisma) => {
  async function listPermissions(): Promise<ListPermissionsOutput> {
    const permissions = await db.permission.findMany();
    return {
      success: true,
      data: permissions,
    };
  }

  return {
    listPermissions,
  };
};

export const permissionsService = permisssionServiceFactory(prisma);
