import { Inputs, Outputs } from "@/config/orpc";

export type CreateGalleryFolderInput = Inputs["gallery"]["createGalleryFolder"];
export type UpdateGalleryFolderInput = Inputs["gallery"]["updateGalleryFolder"];
export type DeleteGalleryFolderInput = Inputs["gallery"]["deleteGalleryFolder"];
export type GenerateUploadSignatureInput = Inputs["gallery"]["generateUploadSignature"];
export type CreateGalleryFileInput = Inputs["gallery"]["createGalleryFile"];
export type DeleteGalleryFileInput = Inputs["gallery"]["deleteGalleryFile"];
export type GetGalleryFileByIdInput = Inputs["gallery"]["getGalleryFileById"];
export type ListGalleryItemsInput = Inputs["gallery"]["listGalleryItems"];

export type GalleryFolderOutput = Outputs["gallery"]["createGalleryFolder"];
export type GalleryFileOutput = Outputs["gallery"]["createGalleryFile"];
export type UploadSignatureOutput = Outputs["gallery"]["generateUploadSignature"];
export type ListGalleryItemsOutput = Outputs["gallery"]["listGalleryItems"];
export type DeleteGalleryFolderOutput = Outputs["gallery"]["deleteGalleryFolder"];
export type DeleteGalleryFileOutput = Outputs["gallery"]["deleteGalleryFile"];
export type GetGalleryFileByIdOutput = Outputs["gallery"]["getGalleryFileById"];
