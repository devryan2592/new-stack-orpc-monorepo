import { Inputs, Outputs } from "@/config/orpc";

export type CreateFolderInput = Inputs["gallery"]["createFolder"];
export type UpdateFolderInput = Inputs["gallery"]["updateFolder"];
export type DeleteFolderInput = Inputs["gallery"]["deleteFolder"];
export type GenerateUploadSignatureInput =
  Inputs["gallery"]["generateUploadSignature"];
export type CreateFileInput = Inputs["gallery"]["createFile"];
export type DeleteFileInput = Inputs["gallery"]["deleteFile"];
export type ListGalleryItemsInput = Inputs["gallery"]["list"];

export type GalleryFolderOutput = Outputs["gallery"]["createFolder"];
export type GalleryFileOutput = Outputs["gallery"]["createFile"];
export type UploadSignatureOutput =
  Outputs["gallery"]["generateUploadSignature"];
export type ListGalleryItemsOutput = Outputs["gallery"]["list"];
export type SuccessOutput = Outputs["gallery"]["deleteFolder"];
