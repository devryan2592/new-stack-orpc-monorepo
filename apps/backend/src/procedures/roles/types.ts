import { Inputs, Outputs } from "@/config/orpc";

export type CreateRoleInput = Inputs["roles"]["createRole"];
export type UpdateRoleInput = Inputs["roles"]["updateRole"];
export type AssignRoleInput = Inputs["roles"]["assignRole"];
export type DeleteRoleInput = Inputs["roles"]["deleteRole"];

export type RoleOutput = Outputs["roles"]["createRole"];
export type ListRolesOutput = Outputs["roles"]["listRoles"];
