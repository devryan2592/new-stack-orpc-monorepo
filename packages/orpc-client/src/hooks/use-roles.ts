"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRolesClient, useRolesQueryInvalidation } from "../utils";

export function useRoles() {
  const client = useRolesClient();
  return useQuery(client.list.queryOptions());
}

export function useCreateRole() {
  const client = useRolesClient();
  const { invalidateAll, invalidateAllRoles } = useRolesQueryInvalidation();

  return useMutation(
    client.create.mutationOptions({
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
    client.update.mutationOptions({
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
    client.delete.mutationOptions({
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
    client.assign.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllRoles();
      },
    })
  );
}
