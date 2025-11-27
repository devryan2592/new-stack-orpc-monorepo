import { prisma } from "@workspace/db";
import { ORPCError } from "@orpc/server";
import type { ListFilesInputType } from "@workspace/orpc-contract";
import {
  GetFileInput,
  DeleteFileInput,
  ListFilesOutput,
  GetFileOutput,
} from "./types";

export const filesServiceFactory = (db: typeof prisma) => {
  async function list(
    userId: string,
    input: { query: ListFilesInputType }
  ): Promise<ListFilesOutput> {
    const { limit = 10, offset = 0, search } = input.query;

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
        files,
        total,
      },
    };
  }

  async function get(
    userId: string,
    input: GetFileInput
  ): Promise<GetFileOutput> {
    const { id } = input.params;

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
      data: file,
    };
  }

  async function deleteFile(
    userId: string,
    input: DeleteFileInput
  ): Promise<{ success: boolean }> {
    const { id } = input.params;

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
    list,
    get,
    delete: deleteFile,
  };
};

export const filesService = filesServiceFactory(prisma);
