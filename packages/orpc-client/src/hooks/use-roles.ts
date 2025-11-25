"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRolesClient, useRolesQueryInvalidation } from "../utils";

export function useRoles() {
  const client = useRolesClient();
  return useQuery(client.list.queryOptions());
}

export function useCreateRole() {
  const client = useRolesClient();
  const { invalidateAll } = useRolesQueryInvalidation();

  return useMutation(
    client.create.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useUpdateRole() {
  const client = useRolesClient();
  const { invalidateAll } = useRolesQueryInvalidation();

  return useMutation(
    client.update.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useDeleteRole() {
  const client = useRolesClient();
  const { invalidateAll } = useRolesQueryInvalidation();

  return useMutation(
    client.delete.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useAssignRole() {
  const client = useRolesClient();
  const { invalidateAll } = useRolesQueryInvalidation();

  return useMutation(
    client.assign.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}
