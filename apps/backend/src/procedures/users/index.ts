import { privateProcedure } from "@/config/orpc";
import { usersService } from "./services";

const me = privateProcedure.users.me.handler(async ({ context }) => {
  return usersService.me(context.user.id);
});

const updateMe = privateProcedure.users.updateMe.handler(
  async ({ input, context }) => {
    return usersService.updateMe(context.user.id, input);
  }
);

const create = privateProcedure.users.create.handler(
  async ({ input, context }) => {
    return usersService.create(context.user.id, input);
  }
);

const list = privateProcedure.users.list.handler(async ({ input, context }) => {
  return usersService.list(context.user.id, input);
});

const deleteUser = privateProcedure.users.delete.handler(
  async ({ input, context }) => {
    return usersService.delete(context.user.id, input);
  }
);

export const usersRouter = {
  me,
  updateMe,
  create,
  list,
  delete: deleteUser,
};
