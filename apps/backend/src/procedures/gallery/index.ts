import { privateProcedure } from "@/config/orpc";
import { galleryService } from "./services";

const createFolder = privateProcedure.gallery.createFolder.handler(
  async ({ input, context }) => {
    return galleryService.createFolder(context.user.id, input);
  }
);

const updateFolder = privateProcedure.gallery.updateFolder.handler(
  async ({ input, context }) => {
    return galleryService.updateFolder(context.user.id, input);
  }
);

const deleteFolder = privateProcedure.gallery.deleteFolder.handler(
  async ({ input, context }) => {
    return galleryService.deleteFolder(context.user.id, input);
  }
);

const generateUploadSignature =
  privateProcedure.gallery.generateUploadSignature.handler(
    async ({ input, context }) => {
      return galleryService.generateUploadSignature(context.user.id, input);
    }
  );

const createFile = privateProcedure.gallery.createFile.handler(
  async ({ input, context }) => {
    return galleryService.createFile(context.user.id, input);
  }
);

const deleteFile = privateProcedure.gallery.deleteFile.handler(
  async ({ input, context }) => {
    return galleryService.deleteFile(context.user.id, input);
  }
);

const list = privateProcedure.gallery.list.handler(
  async ({ input, context }) => {
    return galleryService.list(context.user.id, input);
  }
);

export const galleryRouter = {
  createFolder,
  updateFolder,
  deleteFolder,
  generateUploadSignature,
  createFile,
  deleteFile,
  list,
};
