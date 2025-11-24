import { privateProcedure } from "@/config/orpc";
import { permissionsService } from "./services";

const listPermissions = privateProcedure.permissions.list.handler(async () => {
  return permissionsService.list();
});

export const permissionsRouter = {
  list: listPermissions,
};
