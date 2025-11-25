"use client";

import { useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/server-caller";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export function useORPC() {
  return createTanstackQueryUtils(client);
}

export function usePermissionsClient() {
  return createTanstackQueryUtils(client.permissions, {
    path: ["permissions"],
  });
}

export function usePermissionsQueryInvalidator() {
  const permissionsClient = usePermissionsClient();

  return;
}

// Roles Client
export function useRolesClient() {
  return createTanstackQueryUtils(client.roles, {
    path: ["roles"],
  });
}

export function useRolesQueryInvalidator() {
  const rolesClient = useRolesClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: rolesClient.list.key(),
      }),
  };
}

// Users Client
export function useUsersClient() {
  return createTanstackQueryUtils(client.users, {
    path: ["users"],
  });
}

export function useUsersQueryInvalidator() {
  const usersClient = useUsersClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: usersClient.list.key(),
      }),
    invalidateMe: () =>
      queryClient.invalidateQueries({
        queryKey: usersClient.me.key(),
      }),
  };
}
