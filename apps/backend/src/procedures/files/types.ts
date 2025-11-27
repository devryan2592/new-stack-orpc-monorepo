import { z } from "zod";
import type { ListFilesInputType } from "@workspace/orpc-contract";
import type { FileOutputType } from "@workspace/orpc-contract";

export type { ListFilesInputType, FileOutputType };

export type ListFilesOutput = {
  success: boolean;
  data: {
    files: FileOutputType[];
    total: number;
  };
};

export type GetFileInput = {
  params: {
    id: string;
  };
};

export type GetFileOutput = {
  success: boolean;
  data: FileOutputType;
};

export type DeleteFileInput = {
  params: {
    id: string;
  };
};
