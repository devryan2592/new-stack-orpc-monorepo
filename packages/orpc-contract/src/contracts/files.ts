import { oc } from "@orpc/contract";
import { z } from "zod";
import { listFilesSchema } from "../inputs/files";
import { FileOutputSchema } from "../outputs/files";
import { ApiResponse, SuccessResponse } from "../utils/api";

const listFilesContract = oc
  .route({
    method: "GET",
    path: "/files",
    tags: ["Files"],
    summary: "List all files",
  })
  .input(z.object({ query: listFilesSchema }))
  .output(
    ApiResponse(
      z.object({
        files: z.array(FileOutputSchema),
        total: z.number(),
      })
    )
  );

const getFileByIdContract = oc
  .route({
    method: "GET",
    path: "/files/:id",
    tags: ["Files"],
    summary: "Get file details",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(ApiResponse(FileOutputSchema));

const deleteFileContract = oc
  .route({
    method: "DELETE",
    path: "/files/:id",
    tags: ["Files"],
    summary: "Delete a file",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(SuccessResponse);

export const filesContract = oc.router({
  listFiles: listFilesContract,
  getFileById: getFileByIdContract,
  deleteFile: deleteFileContract,
});
