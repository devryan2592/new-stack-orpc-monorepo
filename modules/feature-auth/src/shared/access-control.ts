import { defaultStatements } from "better-auth/plugins/admin/access";

import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  blog: ["create", "read", "update", "delete"],
} as const;

export const accessControl = createAccessControl(statement);
