import { os } from "@/config/orpc";
import { rolesRouter } from "@/procedures/roles";
import { usersRouter } from "@/procedures/users";
import { galleryRouter } from "@/procedures/gallery";
import { permissionsRouter } from "@/procedures/permissions";
import { filesRouter } from "@/procedures/files";
import { customersRouter } from "@/procedures/customers";
import { leadsRouter } from "@/procedures/leads";

export const router = os.router({
  roles: rolesRouter,
  permissions: permissionsRouter,
  users: usersRouter,
  gallery: galleryRouter,
  files: filesRouter,
  customers: customersRouter,
  leads: leadsRouter,
});

export type Router = typeof router;
