"use client";

import { useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/server-caller";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

/** Hook to get oRPC utilities with TanStack Query integration */
export function useORPC() {
  return createTanstackQueryUtils(client);
}

// Customers Client and Invalidation
export function useCustomersClient() {
  return createTanstackQueryUtils(client.customers, {
    path: ["customers"],
  });
}

export function useCustomersQueryInvalidation() {
  const customersORPC = useCustomersClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: customersORPC.list.key(),
      }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: customersORPC.get.key({ input: { params: { id } } }),
      }),
    invalidateAllCustomers: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "customers",
      }),
  };
}

// Files Client and Invalidation
export function useFilesClient() {
  return createTanstackQueryUtils(client.files, {
    path: ["files"],
  });
}

export function useFilesQueryInvalidation() {
  const filesORPC = useFilesClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: filesORPC.list.key(),
      }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: filesORPC.get.key({ input: { params: { id } } }),
      }),
    invalidateAllFiles: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "files",
      }),
  };
}

// Gallery Client and Invalidation
export function useGalleryClient() {
  return createTanstackQueryUtils(client.gallery, {
    path: ["gallery"],
  });
}

export function useGalleryQueryInvalidation() {
  const galleryORPC = useGalleryClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: galleryORPC.list.key(),
      }),
    invalidateAllGallery: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "gallery",
      }),
  };
}

// Leads Client and Invalidation
export function useLeadsClient() {
  return createTanstackQueryUtils(client.leads, {
    path: ["leads"],
  });
}

export function useLeadsQueryInvalidation() {
  const leadsORPC = useLeadsClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: leadsORPC.getAllLeads.key(),
      }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: leadsORPC.getLeadById.key({ input: { params: { id } } }),
      }),
    invalidateAllLeads: () =>
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "leads";
        },
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
        queryKey: permissionsORPC.list.key(),
      }),
    invalidateAllPermissions: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "permissions",
      }),
  };
}

// Roles Client and Invalidation
export function useRolesClient() {
  return createTanstackQueryUtils(client.roles, {
    path: ["roles"],
  });
}

export function useRolesQueryInvalidation() {
  const rolesORPC = useRolesClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: rolesORPC.list.key(),
      }),
    invalidateAllRoles: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "roles",
      }),
  };
}

// Users Client and Invalidation
export function useUsersClient() {
  return createTanstackQueryUtils(client.users, {
    path: ["users"],
  });
}

export function useUsersQueryInvalidation() {
  const usersORPC = useUsersClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: usersORPC.list.key(),
      }),
    invalidateMe: () =>
      queryClient.invalidateQueries({
        queryKey: usersORPC.me.key(),
      }),
    invalidateAllUsers: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "users",
      }),
  };
}
