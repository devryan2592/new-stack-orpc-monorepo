import { oc } from "@orpc/contract";
import { z } from "zod";
import { createUserSchema, listUsersSchema } from "../inputs/users";
import { UserOutputSchema } from "../outputs/users";

import { updateProfileSchema } from "../inputs/profile";
import { ApiResponse, SuccessResponse } from "../utils/api";

const getMeContract = oc
  .route({
    method: "GET",
    path: "/users/me",
    tags: ["Users"],
    summary: "Get current user profile",
  })
  .output(ApiResponse(UserOutputSchema));

const updateMeContract = oc
  .route({
    method: "PUT",
    path: "/users/me",
    tags: ["Users"],
    summary: "Update current user profile",
  })
  .input(z.object({ body: updateProfileSchema }))
  .output(ApiResponse(UserOutputSchema));

const createUserContract = oc
  .route({
    method: "POST",
    path: "/users",
    tags: ["Users"],
    summary: "Create a new user",
  })
  .input(z.object({ body: createUserSchema }))
  .output(ApiResponse(UserOutputSchema));

const getAllUsersContract = oc
  .route({
    method: "GET",
    path: "/users",
    tags: ["Users"],
    summary: "List all users",
  })
  .input(z.object({ query: listUsersSchema }))
  .output(
    ApiResponse(
      z.object({
        users: z.array(UserOutputSchema),
        total: z.number(),
      })
    )
  );

const deleteUsersContract = oc
  .route({
    method: "DELETE",
    path: "/users/:id",
    tags: ["Users"],
    summary: "Delete a user",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(SuccessResponse);

export const usersContract = oc.router({
  getMe: getMeContract,
  updateMe: updateMeContract,
  createUser: createUserContract,
  listUsers: getAllUsersContract,
  deleteUser: deleteUsersContract,
});
