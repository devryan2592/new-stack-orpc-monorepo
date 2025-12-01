import { privateProcedure } from "@/config/orpc";
import { filesService } from "./services";

const listFiles = privateProcedure.files.listFiles.handler(async ({ input, context }) => {
  return filesService.listFiles(context.user.id, input.query);
});

const getFileById = privateProcedure.files.getFileById.handler(async ({ input, context }) => {
  return filesService.getFileById(context.user.id, input.params.id);
});

const deleteFile = privateProcedure.files.deleteFile.handler(async ({ input, context }) => {
  return filesService.deleteFile(context.user.id, input.params.id);
});

export const filesRouter = {
  listFiles,
  getFileById,
  deleteFile,
};
