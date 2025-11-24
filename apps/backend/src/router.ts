import { os } from "@/config/orpc";
import { rolesRouter } from "@/procedures/roles";
import { usersRouter } from "@/procedures/users";
import { permissionsRouter } from "./procedures/permissions";

export const router = os.router({
  roles: rolesRouter,
  permissions: permissionsRouter,
  users: usersRouter,
});

export type Router = typeof router;
