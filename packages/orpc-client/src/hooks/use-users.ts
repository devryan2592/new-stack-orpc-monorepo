"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useUsersClient, useUsersQueryInvalidation } from "../utils";
import { ListUsersInputType } from "@workspace/orpc-contract/inputs/users";

export function useUsers(input: ListUsersInputType = {}) {
  const client = useUsersClient();
  return useQuery(client.list.queryOptions({ input: { query: input } }));
}

export function useMe() {
  const client = useUsersClient();
  return useQuery(client.me.queryOptions());
}

export function useUpdateMe() {
  const client = useUsersClient();
  const { invalidateAll } = useUsersQueryInvalidation();

  return useMutation(
    client.updateMe.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useCreateUser() {
  const client = useUsersClient();
  const { invalidateAll } = useUsersQueryInvalidation();

  return useMutation(
    client.create.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useDeleteUser() {
  const client = useUsersClient();
  const { invalidateAll } = useUsersQueryInvalidation();

  return useMutation(
    client.delete.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}
