import { oc } from "@orpc/contract";
import { z } from "zod";
import { CreateUserInputSchema, ListUsersInputSchema } from "../inputs/users";
import { UserOutput } from "../outputs/users";

import { UpdateProfileInputSchema } from "../inputs/profile";

export const usersContract = oc.router({
  me: oc
    .route({
      method: "GET",
      path: "/users/me",
      tags: ["Users"],
      summary: "Get current user profile",
    })
    .output(UserOutput),

  updateMe: oc
    .route({
      method: "PUT",
      path: "/users/me",
      tags: ["Users"],
      summary: "Update current user profile",
    })
    .input(z.object({ body: UpdateProfileInputSchema }))
    .output(UserOutput),

  create: oc
    .route({
      method: "POST",
      path: "/users",
      tags: ["Users"],
      summary: "Create a new user",
    })
    .input(z.object({ body: CreateUserInputSchema }))
    .output(UserOutput),

  list: oc
    .route({
      method: "GET",
      path: "/users",
      tags: ["Users"],
      summary: "List all users",
    })
    .input(z.object({ query: ListUsersInputSchema }))
    .output(
      z.object({
        users: z.array(UserOutput),
        total: z.number(),
      })
    ),

  delete: oc
    .route({
      method: "DELETE",
      path: "/users/:id",
      tags: ["Users"],
      summary: "Delete a user",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(z.object({ success: z.boolean() })),
});
