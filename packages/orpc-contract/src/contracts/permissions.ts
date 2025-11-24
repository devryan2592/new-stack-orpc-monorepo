import { oc } from "@orpc/contract";
import { z } from "zod";
import { UpdateUserPermissionsInput } from "../inputs/permissions";

export const permissionsContract = oc.router({
  updateUserPermissions: oc
    .route({
      method: "POST",
      path: "/permissions/user",
      tags: ["Permissions"],
      summary: "Update user permissions",
    })
    .input(z.object({ body: UpdateUserPermissionsInput }))
    .output(z.object({ success: z.boolean() })),

  listPermissions: oc
    .route({
      method: "GET",
      path: "/permissions",
      tags: ["Permissions"],
      summary: "List all available permissions",
    })
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullable(),
        })
      )
    ),
});
