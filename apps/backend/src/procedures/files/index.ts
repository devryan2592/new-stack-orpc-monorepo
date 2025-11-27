import { privateProcedure } from "@/config/orpc";
import { filesService } from "./services";

const list = privateProcedure.files.list.handler(async ({ input, context }) => {
  return filesService.list(context.user.id, input);
});

const get = privateProcedure.files.get.handler(async ({ input, context }) => {
  return filesService.get(context.user.id, input);
});

const deleteFile = privateProcedure.files.delete.handler(
  async ({ input, context }) => {
    return filesService.delete(context.user.id, input);
  }
);

export const filesRouter = {
  list,
  get,
  delete: deleteFile,
};
