import { Inputs, Outputs } from "@/config/orpc";

export type CreateRoleInput = Inputs["roles"]["create"];
export type UpdateRoleInput = Inputs["roles"]["update"];
export type AssignRoleInput = Inputs["roles"]["assign"];
export type DeleteRoleInput = Inputs["roles"]["delete"];

export type RoleOutput = Outputs["roles"]["create"];
export type ListRolesOutput = Outputs["roles"]["list"];
