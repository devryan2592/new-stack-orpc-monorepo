import { privateProcedure } from "@/config/orpc";
import { usersService } from "./services";

const getMe = privateProcedure.users.getMe.handler(async ({ context }) => {
  return usersService.getMe(context.user.id);
});

const updateMe = privateProcedure.users.updateMe.handler(
  async ({ input, context }) => {
    return usersService.updateMe(context.user.id, input);
  }
);

const createUser = privateProcedure.users.createUser.handler(
  async ({ input, context }) => {
    return usersService.createUser(context.user.id, input);
  }
);

const listUsers = privateProcedure.users.listUsers.handler(async ({ input, context }) => {
  return usersService.listUsers(context.user.id, input);
});

const deleteUser = privateProcedure.users.deleteUser.handler(
  async ({ input, context }) => {
    return usersService.deleteUser(context.user.id, input);
  }
);

export const usersRouter = {
  getMe,
  updateMe,
  createUser,
  listUsers,
  deleteUser,
};
