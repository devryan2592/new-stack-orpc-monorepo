import { oc } from "@orpc/contract";
import { z } from "zod";
import { CreateUserInput, ListUsersInput } from "../inputs/users";
import { UserOutput } from "../outputs/users";

import { UpdateProfileInputSchema } from "../inputs/profile";
import { ApiResponse, SuccessResponse } from "../utils/api";

export const usersContract = oc.router({
  me: oc
    .route({
      method: "GET",
      path: "/users/me",
      tags: ["Users"],
      summary: "Get current user profile",
    })
    .output(ApiResponse(UserOutput)),

  updateMe: oc
    .route({
      method: "PUT",
      path: "/users/me",
      tags: ["Users"],
      summary: "Update current user profile",
    })
    .input(z.object({ body: UpdateProfileInputSchema }))
    .output(ApiResponse(UserOutput)),

  create: oc
    .route({
      method: "POST",
      path: "/users",
      tags: ["Users"],
      summary: "Create a new user",
    })
    .input(z.object({ body: CreateUserInput }))
    .output(ApiResponse(UserOutput)),

  list: oc
    .route({
      method: "GET",
      path: "/users",
      tags: ["Users"],
      summary: "List all users",
    })
    .input(z.object({ query: ListUsersInput }))
    .output(
      ApiResponse(
        z.object({
          users: z.array(UserOutput),
          total: z.number(),
        })
      )
    ),
  delete: oc
    .route({
      method: "DELETE",
      path: "/users/:id",
      tags: ["Users"],
      summary: "Delete a user",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(SuccessResponse),
});
