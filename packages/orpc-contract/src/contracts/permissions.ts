import { oc } from "@orpc/contract";
import { z } from "zod";
import { updateUserPermissionsSchema } from "../inputs/permissions";
import { PermissionOutputSchema } from "../outputs/permissions";
import { ApiResponse } from "../utils/api";

const listPermissions = oc
  .route({
    method: "GET",
    path: "/permissions",
    tags: ["Permissions"],
    summary: "List all available permissions",
  })
  .output(ApiResponse(z.array(PermissionOutputSchema)));

export const permissionsContract = oc.router({
  listPermissions: listPermissions,
});
