import { privateProcedure } from "@/config/orpc";
import { rolesService } from "./services";

const createRole = privateProcedure.roles.createRole.handler(
  async ({ input, context }) => {
    return rolesService.createRole(context.user.id, input);
  }
);

const listRoles = privateProcedure.roles.listRoles.handler(async ({ context }) => {
  return rolesService.listRoles(context.user.id);
});

const updateRole = privateProcedure.roles.updateRole.handler(
  async ({ input, context }) => {
    return rolesService.updateRole(context.user.id, input);
  }
);

const deleteRole = privateProcedure.roles.deleteRole.handler(
  async ({ input, context }) => {
    return rolesService.deleteRole(context.user.id, input);
  }
);

const assignRole = privateProcedure.roles.assignRole.handler(
  async ({ input, context }) => {
    return rolesService.assignRole(context.user.id, input);
  }
);

export const rolesRouter = {
  createRole,
  listRoles,
  updateRole,
  deleteRole,
  assignRole,
};
