import { createUploadthing } from "uploadthing/server";
import { prisma } from "@workspace/db";
import type { FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter: FileRouter = {
  documentUploader: f({
    image: { maxFileSize: "8MB" },
    pdf: { maxFileSize: "8MB" },
    text: { maxFileSize: "8MB" },
    blob: { maxFileSize: "8MB" },
  })
    .middleware(async ({ req }) => {
      // Auth is handled by the express middleware before this, or we can verify here
      // For now, let's assume the user is authenticated if they can reach here,
      // but UploadThing requests might come from client directly.

      // TODO: Implement proper auth check using BetterAuth
      // For now, we return a dummy user ID or check headers if possible.

      return { userId: "user_123" }; // Placeholder until we integrate auth properly in this context
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      await prisma.file.create({
        data: {
          key: file.key,
          url: file.ufsUrl,
          name: file.name,
          mimeType: file.type,
          size: file.size,
          uploaderId: metadata.userId, // We need a real user ID here.
        },
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
