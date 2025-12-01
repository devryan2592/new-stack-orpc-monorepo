import { z } from "zod";
import { FileType } from "../shared";

export const GalleryFolderOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GalleryFileOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  type: FileType, // IMAGE, VIDEO
  size: z.number(),
  publicId: z.string(),
  folderId: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GalleryItemOutputSchema = z.union([
  GalleryFolderOutputSchema.extend({ itemType: z.literal("FOLDER") }),
  GalleryFileOutputSchema.extend({ itemType: z.literal("FILE") }),
]);

export const UploadSignatureOutputSchema = z.object({
  signature: z.string(),
  timestamp: z.number(),
  cloudName: z.string(),
  apiKey: z.string(),
  folder: z.string().optional(),
});

// Export TypeScript types
export type GalleryFolderOutputType = z.infer<typeof GalleryFolderOutputSchema>;
export type GalleryFileOutputType = z.infer<typeof GalleryFileOutputSchema>;
export type GalleryItemOutputType = z.infer<typeof GalleryItemOutputSchema>;
export type UploadSignatureOutputType = z.infer<
  typeof UploadSignatureOutputSchema
>;
