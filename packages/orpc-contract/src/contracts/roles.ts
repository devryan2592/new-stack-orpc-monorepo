import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  assignRoleSchema,
  createRoleSchema,
  updateRoleSchema,
} from "../inputs/roles";
import { RoleOutputSchema } from "../outputs/roles";
import { SuccessResponse } from "../utils/api";

const createRolesContract = oc
  .route({
    method: "POST",
    path: "/roles",
    tags: ["Roles"],
    summary: "Create a new role",
  })
  .input(z.object({ body: createRoleSchema }))
  .output(RoleOutputSchema);

const getAllRolesContract = oc
  .route({
    method: "GET",
    path: "/roles",
    tags: ["Roles"],
    summary: "List all roles",
  })
  .output(z.array(RoleOutputSchema));

const updateRolesContract = oc
  .route({
    method: "PUT",
    path: "/roles/:id",
    tags: ["Roles"],
    summary: "Update a role",
  })
  .input(
    z.object({
      params: z.object({ id: z.string() }),
      body: updateRoleSchema,
    })
  )
  .output(RoleOutputSchema);

const deleteRolesContract = oc
  .route({
    method: "DELETE",
    path: "/roles/:id",
    tags: ["Roles"],
    summary: "Delete a role",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(SuccessResponse);

const assignRolesContract = oc
  .route({
    method: "POST",
    path: "/roles/assign",
    tags: ["Roles"],
    summary: "Assign a role to a user",
  })
  .input(z.object({ body: assignRoleSchema }))
  .output(SuccessResponse);

export const rolesContract = oc.router({
  createRole: createRolesContract,
  listRoles: getAllRolesContract,
  updateRole: updateRolesContract,
  deleteRole: deleteRolesContract,
  assignRole: assignRolesContract,
});
