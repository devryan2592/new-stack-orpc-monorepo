import { adminAc } from "better-auth/plugins/admin/access";
import { accessControl } from "./access-control";

export const userRole = accessControl.newRole({
  blog: ["read"],
});

export const adminRole = accessControl.newRole({
  blog: ["create", "read", "update", "delete"],
  ...adminAc.statements,
});

export const staffRole = accessControl.newRole({
  blog: ["read"],
});

export const editorRole = accessControl.newRole({
  blog: ["create", "read", "update"],
});

export const managerRole = accessControl.newRole({
  blog: ["create", "read", "update"],
});
