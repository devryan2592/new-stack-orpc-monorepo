// packages/orpc-client/src/utils.tsx
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { client } from "./lib/server-caller";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

/** Hook to get oRPC utilities with TanStack Query integration */
export function useORPC() {
  return createTanstackQueryUtils(client);
}

// Roles Client and Invalidation
export function useRolesClient() {
  return createTanstackQueryUtils(client.roles, { path: ["roles"] });
}

export function useRolesQueryInvalidation() {
  const rolesORPC = useRolesClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: rolesORPC.list.key() }),
    invalidateAllRoles: () =>
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === "roles",
      }),
  };
}

// Permissions Client and Invalidation
export function usePermissionsClient() {
  return createTanstackQueryUtils(client.permissions, {
    path: ["permissions"],
  });
}

export function usePermissionsQueryInvalidation() {
  const permissionsORPC = usePermissionsClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: permissionsORPC.listPermissions.key(),
      }),
    invalidateAllPermissions: () =>
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === "permissions",
      }),
  };
}

// Users Client and Invalidation
export function useUsersClient() {
  return createTanstackQueryUtils(client.users, { path: ["users"] });
}

export function useUsersQueryInvalidation() {
  const usersORPC = useUsersClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: usersORPC.list.key() }),
    invalidateAllUsers: () =>
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === "users",
      }),
  };
}
