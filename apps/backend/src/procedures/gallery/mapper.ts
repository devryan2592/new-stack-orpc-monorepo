import type { Prisma } from "@workspace/db";
import {
  GalleryFolderOutputType,
  GalleryFileOutputType,
  GalleryItemOutputType,
} from "@workspace/orpc-contract";

export type GalleryFolderWithRelations = Prisma.GalleryFolderGetPayload<{}>;
export type GalleryFileWithRelations = Prisma.GalleryFileGetPayload<{}>;

export const mapFolderToOutput = (
  folder: GalleryFolderWithRelations
): GalleryFolderOutputType => {
  return {
    id: folder.id,
    name: folder.name,
    parentId: folder.parentId,
    userId: folder.userId,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
};

export const mapFileToOutput = (
  file: GalleryFileWithRelations
): GalleryFileOutputType => {
  return {
    id: file.id,
    name: file.name,
    url: file.url,
    type: file.type as any,
    size: file.size,
    publicId: file.publicId,
    folderId: file.folderId,
    userId: file.userId,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
};

export const mapFolderToItem = (
  folder: GalleryFolderWithRelations
): GalleryItemOutputType => {
  return {
    ...mapFolderToOutput(folder),
    itemType: "FOLDER",
  };
};

export const mapFileToItem = (
  file: GalleryFileWithRelations
): GalleryItemOutputType => {
  return {
    ...mapFileToOutput(file),
    itemType: "FILE",
  };
};
