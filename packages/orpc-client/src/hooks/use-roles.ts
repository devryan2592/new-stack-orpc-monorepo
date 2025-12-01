"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRolesClient, useRolesQueryInvalidation } from "../utils";

export function useRoles() {
  const client = useRolesClient();
  return useQuery(client.listRoles.queryOptions());
}

export function useCreateRole() {
  const client = useRolesClient();
  const { invalidateAll, invalidateAllRoles } = useRolesQueryInvalidation();

  return useMutation(
    client.createRole.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllRoles();
      },
    })
  );
}

export function useUpdateRole() {
  const client = useRolesClient();
  const { invalidateAll, invalidateAllRoles } = useRolesQueryInvalidation();

  return useMutation(
    client.updateRole.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllRoles();
      },
    })
  );
}

export function useDeleteRole() {
  const client = useRolesClient();
  const { invalidateAllRoles } = useRolesQueryInvalidation();

  return useMutation(
    client.deleteRole.mutationOptions({
      onSuccess: () => {
        invalidateAllRoles();
      },
    })
  );
}

export function useAssignRole() {
  const client = useRolesClient();
  const { invalidateAll, invalidateAllRoles } = useRolesQueryInvalidation();

  return useMutation(
    client.assignRole.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllRoles();
      },
    })
  );
}
