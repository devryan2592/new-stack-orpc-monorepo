import { Inputs, Outputs } from "@/config/orpc";

export type ListFilesInput = Inputs["files"]["listFiles"];
export type GetFileInput = Inputs["files"]["getFileById"];
export type DeleteFileInput = Inputs["files"]["deleteFile"];

export type ListFilesOutput = Outputs["files"]["listFiles"];
export type FileOutput = Outputs["files"]["getFileById"];
