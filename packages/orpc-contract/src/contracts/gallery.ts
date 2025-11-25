import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  CreateFileInputSchema,
  CreateFolderInputSchema,
  GenerateUploadSignatureInputSchema,
  ListGalleryItemsInputSchema,
  UpdateFolderInputSchema,
} from "../inputs/gallery";
import {
  GalleryFileOutput,
  GalleryFolderOutput,
  GalleryItemOutput,
  UploadSignatureOutput,
} from "../outputs/gallery";
import { ApiResponse, SuccessResponse } from "../utils/api";

export const galleryContract = oc.router({
  createFolder: oc
    .route({
      method: "POST",
      path: "/gallery/folders",
      tags: ["Gallery"],
      summary: "Create a new folder",
    })
    .input(z.object({ body: CreateFolderInputSchema }))
    .output(ApiResponse(GalleryFolderOutput)),

  updateFolder: oc
    .route({
      method: "PUT",
      path: "/gallery/folders/:id",
      tags: ["Gallery"],
      summary: "Update a folder",
    })
    .input(
      z.object({
        params: z.object({ id: z.string() }),
        body: UpdateFolderInputSchema,
      })
    )
    .output(ApiResponse(GalleryFolderOutput)),

  deleteFolder: oc
    .route({
      method: "DELETE",
      path: "/gallery/folders/:id",
      tags: ["Gallery"],
      summary: "Delete a folder",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(SuccessResponse),

  generateUploadSignature: oc
    .route({
      method: "POST",
      path: "/gallery/upload-signature",
      tags: ["Gallery"],
      summary: "Generate Cloudinary upload signature",
    })
    .input(z.object({ body: GenerateUploadSignatureInputSchema }))
    .output(ApiResponse(UploadSignatureOutput)),

  createFile: oc
    .route({
      method: "POST",
      path: "/gallery/files",
      tags: ["Gallery"],
      summary: "Save file metadata",
    })
    .input(z.object({ body: CreateFileInputSchema }))
    .output(ApiResponse(GalleryFileOutput)),

  deleteFile: oc
    .route({
      method: "DELETE",
      path: "/gallery/files/:id",
      tags: ["Gallery"],
      summary: "Delete a file",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(SuccessResponse),

  list: oc
    .route({
      method: "GET",
      path: "/gallery",
      tags: ["Gallery"],
      summary: "List gallery items",
    })
    .input(z.object({ query: ListGalleryItemsInputSchema }))
    .output(ApiResponse(z.array(GalleryItemOutput))),
});
