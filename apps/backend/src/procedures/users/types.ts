import { Inputs, Outputs } from "@/config/orpc";

export type CreateUserInput = Inputs["users"]["create"];
export type ListUsersInput = Inputs["users"]["list"];
export type UpdateMeInput = Inputs["users"]["updateMe"];
export type DeleteUserInput = Inputs["users"]["delete"];

export type UserOutput = Outputs["users"]["me"];
export type ListUsersOutput = Outputs["users"]["list"];
