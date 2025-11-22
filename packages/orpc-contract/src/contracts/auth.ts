import { z } from "zod";
import {
  roleCreateInput,
  roleUpdateInput,
  roleDeleteInput,
  roleGetInput,
  roleListInput,
  permissionCreateInput,
  permissionUpdateInput,
  permissionDeleteInput,
  permissionGetInput,
  permissionListInput,
  roleAssignInput,
  roleRemoveInput,
  userRolesListInput,
  rolePermissionsSetInput,
  rolePermissionsListInput,
} from "../inputs/auth";
import {
  roleListOutput,
  permissionListOutput,
  roleOutput,
  permissionOutput,
  emptyOutput,
} from "../outputs/auth";

export const authContracts = {
  role: {
    create: { input: roleCreateInput, output: roleOutput },
    update: { input: roleUpdateInput, output: roleOutput },
    delete: { input: roleDeleteInput, output: emptyOutput },
    get: { input: roleGetInput, output: roleOutput },
    list: { input: roleListInput, output: roleListOutput },
  },
  permission: {
    create: { input: permissionCreateInput, output: permissionOutput },
    update: { input: permissionUpdateInput, output: permissionOutput },
    delete: { input: permissionDeleteInput, output: emptyOutput },
    get: { input: permissionGetInput, output: permissionOutput },
    list: { input: permissionListInput, output: permissionListOutput },
  },
  userRole: {
    assign: { input: roleAssignInput, output: emptyOutput },
    remove: { input: roleRemoveInput, output: emptyOutput },
    listForUser: { input: userRolesListInput, output: roleListOutput },
  },
  rolePermissions: {
    set: { input: rolePermissionsSetInput, output: emptyOutput },
    list: { input: rolePermissionsListInput, output: permissionListOutput },
  },
};

export type AuthContracts = typeof authContracts;