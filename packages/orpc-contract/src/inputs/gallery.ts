import { z } from "zod";

export const CreateFolderInputSchema = z.object({
  name: z.string().min(1),
  parentId: z.string().optional(),
});

export const UpdateFolderInputSchema = z.object({
  name: z.string().min(1),
});

export const GenerateUploadSignatureInputSchema = z.object({
  folderId: z.string().optional(),
  type: z.enum(["IMAGE", "VIDEO"]).optional(),
});

export const CreateFileInputSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  type: z.enum(["IMAGE", "VIDEO"]),
  size: z.number(),
  publicId: z.string(),
  folderId: z.string().optional(),
});

export const ListGalleryItemsInputSchema = z.object({
  folderId: z.string().optional(), // If null/undefined, list root
  type: z.enum(["IMAGE", "VIDEO"]).optional(),
});

export type CreateFolderInputType = z.input<typeof CreateFolderInputSchema>;
export type UpdateFolderInputType = z.input<typeof UpdateFolderInputSchema>;
export type GenerateUploadSignatureInputType = z.input<
  typeof GenerateUploadSignatureInputSchema
>;
export type CreateFileInputType = z.input<typeof CreateFileInputSchema>;
export type ListGalleryItemsInputType = z.input<
  typeof ListGalleryItemsInputSchema
>;
