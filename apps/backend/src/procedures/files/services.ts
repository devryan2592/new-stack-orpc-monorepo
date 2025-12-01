import { prisma } from "@workspace/db";
import { ORPCError } from "@orpc/server";
import {
  ListFilesInput,
  ListFilesOutput,
  FileOutput,
} from "./types";
import mapFileToOutput from "./mapper";

export const filesServiceFactory = (db: typeof prisma) => {
  async function listFiles(
    userId: string,
    input: ListFilesInput["query"]
  ): Promise<ListFilesOutput> {
    const { limit = 10, offset = 0, search } = input;

    const where: any = {
      uploaderId: userId,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [files, total] = await Promise.all([
      db.file.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { uploadedAt: "desc" },
      }),
      db.file.count({ where }),
    ]);

    return {
      success: true,
      data: {
        files: files.map(mapFileToOutput),
        total,
      },
    };
  }

  async function getFileById(
    userId: string,
    id: string
  ): Promise<FileOutput> {
    const file = await db.file.findFirst({
      where: {
        id,
        uploaderId: userId,
      },
    });

    if (!file) {
      throw new ORPCError("NOT_FOUND", { message: "File not found" });
    }

    return {
      success: true,
      data: mapFileToOutput(file),
    };
  }

  async function deleteFile(
    userId: string,
    id: string
  ): Promise<{ success: boolean }> {
    const file = await db.file.findFirst({
      where: {
        id,
        uploaderId: userId,
      },
    });

    if (!file) {
      throw new ORPCError("NOT_FOUND", { message: "File not found" });
    }

    await db.file.delete({ where: { id } });

    // TODO: Delete from UploadThing as well
    // We might need to call UploadThing API to delete the file from their storage

    return { success: true };
  }

  return {
    listFiles,
    getFileById,
    deleteFile,
  };
};

export const filesService = filesServiceFactory(prisma);
