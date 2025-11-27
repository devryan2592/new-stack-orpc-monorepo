import { oc } from "@orpc/contract";
import { z } from "zod";
import { ListFilesInput } from "../inputs/files";
import { FileOutput } from "../outputs/files";
import { ApiResponse, SuccessResponse } from "../utils/api";

export const filesContract = oc.router({
  list: oc
    .route({
      method: "GET",
      path: "/files",
      tags: ["Files"],
      summary: "List all files",
    })
    .input(z.object({ query: ListFilesInput }))
    .output(
      ApiResponse(
        z.object({
          files: z.array(FileOutput),
          total: z.number(),
        })
      )
    ),

  get: oc
    .route({
      method: "GET",
      path: "/files/:id",
      tags: ["Files"],
      summary: "Get file details",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(ApiResponse(FileOutput)),

  delete: oc
    .route({
      method: "DELETE",
      path: "/files/:id",
      tags: ["Files"],
      summary: "Delete a file",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(SuccessResponse),
});
