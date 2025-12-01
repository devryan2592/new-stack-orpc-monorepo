import { privateProcedure } from "@/config/orpc";
import { permissionsService } from "./services";

const listPermissions = privateProcedure.permissions.listPermissions.handler(async () => {
  return permissionsService.listPermissions();
});

export const permissionsRouter = {
  listPermissions,
};
