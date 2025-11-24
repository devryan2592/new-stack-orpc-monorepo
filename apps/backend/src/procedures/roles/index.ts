import { privateProcedure } from "@/config/orpc";
import { rolesService } from "./services";

const create = privateProcedure.roles.create.handler(
  async ({ input, context }) => {
    return rolesService.create(context.user.id, input);
  }
);

const list = privateProcedure.roles.list.handler(async ({ context }) => {
  return rolesService.list(context.user.id);
});

const update = privateProcedure.roles.update.handler(
  async ({ input, context }) => {
    return rolesService.update(context.user.id, input);
  }
);

const deleteRole = privateProcedure.roles.delete.handler(
  async ({ input, context }) => {
    return rolesService.delete(context.user.id, input);
  }
);

const assign = privateProcedure.roles.assign.handler(
  async ({ input, context }) => {
    return rolesService.assign(context.user.id, input);
  }
);

export const rolesRouter = {
  create,
  list,
  update,
  delete: deleteRole,
  assign,
};
