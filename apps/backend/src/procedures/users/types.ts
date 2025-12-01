import { Inputs, Outputs } from "@/config/orpc";

export type CreateUserInput = Inputs["users"]["createUser"];
export type ListUsersInput = Inputs["users"]["listUsers"];
export type UpdateMeInput = Inputs["users"]["updateMe"];
export type DeleteUserInput = Inputs["users"]["deleteUser"];

export type UserOutput = Outputs["users"]["getMe"];
export type ListUsersOutput = Outputs["users"]["listUsers"];
