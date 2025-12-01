import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  createFileSchema,
  createFolderSchema,
  generateUploadSignatureSchema,
  listGalleryItemsSchema,
  updateFolderSchema,
} from "../inputs/gallery";
import {
  GalleryFileOutputSchema,
  GalleryFolderOutputSchema,
  GalleryItemOutputSchema,
  UploadSignatureOutputSchema,
} from "../outputs/gallery";
import { ApiResponse, SuccessResponse } from "../utils/api";

const createGalleryFolderContract = oc
  .route({
    method: "POST",
    path: "/gallery/folders",
    tags: ["Gallery"],
    summary: "Create a new folder",
  })
  .input(z.object({ body: createFolderSchema }))
  .output(ApiResponse(GalleryFolderOutputSchema));

const updateGalleryFolderContract = oc
  .route({
    method: "PUT",
    path: "/gallery/folders/:id",
    tags: ["Gallery"],
    summary: "Update a folder",
  })
  .input(
    z.object({
      params: z.object({ id: z.string() }),
      body: updateFolderSchema,
    })
  )
  .output(ApiResponse(GalleryFolderOutputSchema));

const deleteGalleryFolderContract = oc
  .route({
    method: "DELETE",
    path: "/gallery/folders/:id",
    tags: ["Gallery"],
    summary: "Delete a folder",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(SuccessResponse);

const generateUploadSignatureContract = oc
  .route({
    method: "POST",
    path: "/gallery/upload-signature",
    tags: ["Gallery"],
    summary: "Generate Cloudinary upload signature",
  })
  .input(z.object({ body: generateUploadSignatureSchema }))
  .output(ApiResponse(UploadSignatureOutputSchema));

const createGalleryFileContract = oc
  .route({
    method: "POST",
    path: "/gallery/files",
    tags: ["Gallery"],
    summary: "Save file metadata",
  })
  .input(z.object({ body: createFileSchema }))
  .output(ApiResponse(GalleryFileOutputSchema));

const deleteGalleryFileContract = oc
  .route({
    method: "DELETE",
    path: "/gallery/files/:id",
    tags: ["Gallery"],
    summary: "Delete a file",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(SuccessResponse);

const getGalleryFileByIdContract = oc
  .route({
    method: "GET",
    path: "/gallery/files/:id",
    tags: ["Gallery"],
    summary: "Get file details",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(ApiResponse(GalleryFileOutputSchema));

const getAllGalleryItemsContract = oc
  .route({
    method: "GET",
    path: "/gallery",
    tags: ["Gallery"],
    summary: "List gallery items",
  })
  .input(z.object({ query: listGalleryItemsSchema }))
  .output(ApiResponse(z.array(GalleryItemOutputSchema)));

export const galleryContract = oc.router({
  createGalleryFolder: createGalleryFolderContract,
  updateGalleryFolder: updateGalleryFolderContract,
  deleteGalleryFolder: deleteGalleryFolderContract,
  generateUploadSignature: generateUploadSignatureContract,
  createGalleryFile: createGalleryFileContract,
  deleteGalleryFile: deleteGalleryFileContract,
  getGalleryFileById: getGalleryFileByIdContract,
  listGalleryItems: getAllGalleryItemsContract,
});
