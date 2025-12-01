import { prisma } from "@workspace/db";
import { ORPCError } from "@orpc/server";
import { v2 as cloudinary } from "cloudinary";
import {
  CreateGalleryFolderInput,
  UpdateGalleryFolderInput,
  GenerateUploadSignatureInput,
  CreateGalleryFileInput,
  ListGalleryItemsInput,
  GalleryFolderOutput,
  GalleryFileOutput,
  UploadSignatureOutput,
  ListGalleryItemsOutput,
  DeleteGalleryFolderOutput,
  DeleteGalleryFileOutput,
  GetGalleryFileByIdOutput,
} from "./types";
import {
  mapFolderToOutput,
  mapFileToOutput,
  mapFolderToItem,
  mapFileToItem,
} from "./mapper";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const galleryServiceFactory = (db: typeof prisma) => {
  async function createGalleryFolder(
    userId: string,
    input: CreateGalleryFolderInput["body"]
  ): Promise<GalleryFolderOutput> {
    const { name, parentId } = input;

    if (parentId) {
      const parent = await db.galleryFolder.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        throw new ORPCError("NOT_FOUND", {
          message: "Parent folder not found",
        });
      }
    }

    const folder = await db.galleryFolder.create({
      data: {
        name,
        parentId,
        userId,
      },
    });

    return {
      success: true,
      data: mapFolderToOutput(folder),
    };
  }

  async function updateGalleryFolder(
    userId: string,
    id: string,
    input: UpdateGalleryFolderInput["body"]
  ): Promise<GalleryFolderOutput> {
    const { name } = input;

    const folder = await db.galleryFolder.findUnique({
      where: { id },
    });

    if (!folder) {
      throw new ORPCError("NOT_FOUND", { message: "Folder not found" });
    }

    // Optional: Check ownership or permissions
    // if (folder.userId !== userId) throw new ORPCError("FORBIDDEN", ...);

    const updated = await db.galleryFolder.update({
      where: { id },
      data: { name },
    });

    return {
      success: true,
      data: mapFolderToOutput(updated),
    };
  }

  async function deleteGalleryFolder(
    userId: string,
    id: string
  ): Promise<DeleteGalleryFolderOutput> {
    const folder = await db.galleryFolder.findUnique({
      where: { id },
      include: {
        children: true,
        files: true,
      },
    });

    if (!folder) {
      throw new ORPCError("NOT_FOUND", { message: "Folder not found" });
    }

    if (folder.children.length > 0 || folder.files.length > 0) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Folder is not empty. Please delete contents first.",
      });
    }

    await db.galleryFolder.delete({ where: { id } });

    return { success: true };
  }

  async function generateUploadSignature(
    userId: string,
    input: GenerateUploadSignatureInput["body"]
  ): Promise<UploadSignatureOutput> {
    const { folderId, type } = input;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = folderId ? folderId : "root"; // You might want to map folderId to a Cloudinary folder path

    // Basic signature generation
    const params: any = {
      timestamp,
      // folder, // Optional: organize in Cloudinary folders
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    return {
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        folder: params.folder,
      },
    };
  }

  async function createGalleryFile(
    userId: string,
    input: CreateGalleryFileInput["body"]
  ): Promise<GalleryFileOutput> {
    const { name, url, type, size, publicId, folderId } = input;

    const file = await db.galleryFile.create({
      data: {
        name,
        url,
        type,
        size,
        publicId,
        folderId,
        userId,
      },
    });

    return {
      success: true,
      data: mapFileToOutput(file),
    };
  }

  async function deleteGalleryFile(
    userId: string,
    id: string
  ): Promise<DeleteGalleryFileOutput> {
    const file = await db.galleryFile.findUnique({
      where: { id },
    });

    if (!file) {
      throw new ORPCError("NOT_FOUND", { message: "File not found" });
    }

    // Delete from Cloudinary
    if (file.publicId) {
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: file.type.toLowerCase() === "video" ? "video" : "image",
      });
    }

    await db.galleryFile.delete({ where: { id } });

    return { success: true };
  }

  async function getGalleryFileById(
    userId: string,
    id: string
  ): Promise<GetGalleryFileByIdOutput> {
    const file = await db.galleryFile.findUnique({
      where: { id },
    });

    if (!file) {
      throw new ORPCError("NOT_FOUND", { message: "File not found" });
    }

    return {
      success: true,
      data: mapFileToOutput(file),
    };
  }

  async function listGalleryItems(
    userId: string,
    input: ListGalleryItemsInput["query"]
  ): Promise<ListGalleryItemsOutput> {
    const { folderId, type } = input;

    const whereFolder: any = {
      parentId: folderId || null,
    };

    const whereFile: any = {
      folderId: folderId || null,
    };

    if (type) {
      whereFile.type = type;
    }

    const [folders, files] = await Promise.all([
      db.galleryFolder.findMany({
        where: whereFolder,
        orderBy: { name: "asc" },
      }),
      db.galleryFile.findMany({
        where: whereFile,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const items = [
      ...folders.map(mapFolderToItem),
      ...files.map(mapFileToItem),
    ];

    return {
      success: true,
      data: items,
    };
  }

  return {
    createGalleryFolder,
    updateGalleryFolder,
    deleteGalleryFolder,
    generateUploadSignature,
    createGalleryFile,
    deleteGalleryFile,
    getGalleryFileById,
    listGalleryItems,
  };
};

export const galleryService = galleryServiceFactory(prisma);
