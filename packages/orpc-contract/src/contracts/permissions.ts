import { oc } from "@orpc/contract";
import { z } from "zod";
import { UpdateUserPermissionsInput } from "../inputs/permissions";
import { PermissionOutput } from "../outputs/permissions";
import { ApiResponse } from "../utils/api";

export const listPermissions = oc
  .route({
    method: "GET",
    path: "/permissions",
    tags: ["Permissions"],
    summary: "List all available permissions",
  })
  .output(ApiResponse(z.array(PermissionOutput)));

export const permissionsContract = oc.router({
  list: listPermissions,
});
