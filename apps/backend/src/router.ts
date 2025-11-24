import { os } from "@/config/orpc";
import { rolesRouter } from "@/procedures/auth/roles";
import { permissionsRouter } from "@/procedures/auth/permissions";
import { usersRouter } from "@/procedures/auth/users";

export const router = os.router({
  roles: rolesRouter,
  permissions: permissionsRouter,
  users: usersRouter,
});

export type Router = typeof router;
