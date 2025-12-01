import { privateProcedure } from "@/config/orpc";
import { galleryService } from "./services";

const createGalleryFolder = privateProcedure.gallery.createGalleryFolder.handler(async ({ input, context }) => {
  return galleryService.createGalleryFolder(context.user.id, input.body);
});

const updateGalleryFolder = privateProcedure.gallery.updateGalleryFolder.handler(async ({ input, context }) => {
  return galleryService.updateGalleryFolder(context.user.id, input.params.id, input.body);
});

const deleteGalleryFolder = privateProcedure.gallery.deleteGalleryFolder.handler(async ({ input, context }) => {
  return galleryService.deleteGalleryFolder(context.user.id, input.params.id);
});

const generateUploadSignature = privateProcedure.gallery.generateUploadSignature.handler(async ({ input, context }) => {
  return galleryService.generateUploadSignature(context.user.id, input.body);
});

const createGalleryFile = privateProcedure.gallery.createGalleryFile.handler(async ({ input, context }) => {
  return galleryService.createGalleryFile(context.user.id, input.body);
});

const deleteGalleryFile = privateProcedure.gallery.deleteGalleryFile.handler(async ({ input, context }) => {
  return galleryService.deleteGalleryFile(context.user.id, input.params.id);
});

const getGalleryFileById = privateProcedure.gallery.getGalleryFileById.handler(async ({ input, context }) => {
  return galleryService.getGalleryFileById(context.user.id, input.params.id);
});

const listGalleryItems = privateProcedure.gallery.listGalleryItems.handler(async ({ input, context }) => {
  return galleryService.listGalleryItems(context.user.id, input.query);
});

export const galleryRouter = {
  createGalleryFolder,
  updateGalleryFolder,
  deleteGalleryFolder,
  generateUploadSignature,
  createGalleryFile,
  deleteGalleryFile,
  getGalleryFileById,
  listGalleryItems,
};
