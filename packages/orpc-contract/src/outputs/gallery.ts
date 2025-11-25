import { z } from "zod";

export const GalleryFolderOutput = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GalleryFileOutput = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.string(), // IMAGE, VIDEO
  size: z.number(),
  publicId: z.string(),
  folderId: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GalleryItemOutput = z.union([
  GalleryFolderOutput.extend({ itemType: z.literal("FOLDER") }),
  GalleryFileOutput.extend({ itemType: z.literal("FILE") }),
]);

export const UploadSignatureOutput = z.object({
  signature: z.string(),
  timestamp: z.number(),
  cloudName: z.string(),
  apiKey: z.string(),
  folder: z.string().optional(),
});

// Export TypeScript types
export type GalleryFolderOutputType = z.infer<typeof GalleryFolderOutput>;
export type GalleryFileOutputType = z.infer<typeof GalleryFileOutput>;
export type GalleryItemOutputType = z.infer<typeof GalleryItemOutput>;
export type UploadSignatureOutputType = z.infer<typeof UploadSignatureOutput>;
