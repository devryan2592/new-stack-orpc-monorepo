import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  CreateRoleInputSchema,
  UpdateRoleInputSchema,
  AssignRoleInputSchema,
} from "../inputs/roles";
import { RoleOutput } from "../outputs/roles";

export const rolesContract = oc.router({
  create: oc
    .route({
      method: "POST",
      path: "/roles",
      tags: ["Roles"],
      summary: "Create a new role",
    })
    .input(z.object({ body: CreateRoleInputSchema }))
    .output(RoleOutput),

  list: oc
    .route({
      method: "GET",
      path: "/roles",
      tags: ["Roles"],
      summary: "List all roles",
    })
    .output(z.array(RoleOutput)),

  update: oc
    .route({
      method: "PUT",
      path: "/roles/:id",
      tags: ["Roles"],
      summary: "Update a role",
    })
    .input(
      z.object({
        params: z.object({ id: z.string() }),
        body: UpdateRoleInputSchema,
      })
    )
    .output(RoleOutput),

  delete: oc
    .route({
      method: "DELETE",
      path: "/roles/:id",
      tags: ["Roles"],
      summary: "Delete a role",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(z.object({ success: z.boolean() })),

  assign: oc
    .route({
      method: "POST",
      path: "/roles/assign",
      tags: ["Roles"],
      summary: "Assign a role to a user",
    })
    .input(z.object({ body: AssignRoleInputSchema }))
    .output(z.object({ success: z.boolean() })),
});
