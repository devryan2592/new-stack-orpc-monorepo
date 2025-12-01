import { z } from "zod";
import { FileType } from "../shared";

export const createFolderSchema = z.object({
  name: z.string().min(1),
  parentId: z.string().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1),
});

export const generateUploadSignatureSchema = z.object({
  folderId: z.string().optional(),
  type: FileType.optional(),
});

export const createFileSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  type: FileType,
  size: z.number(),
  publicId: z.string(),
  folderId: z.string().optional(),
});

export const listGalleryItemsSchema = z.object({
  folderId: z.string().optional(), // If null/undefined, list root
  type: FileType.optional(),
});

export type CreateFolderInputType = z.input<typeof createFolderSchema>;
export type UpdateFolderInputType = z.input<typeof updateFolderSchema>;
export type GenerateUploadSignatureInputType = z.input<
  typeof generateUploadSignatureSchema
>;
export type CreateFileInputType = z.input<typeof createFileSchema>;
export type ListGalleryItemsInputType = z.input<
  typeof listGalleryItemsSchema
>;
