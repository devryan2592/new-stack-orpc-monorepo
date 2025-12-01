"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useUsersClient, useUsersQueryInvalidation } from "../utils";
import { ListUsersInputType } from "@workspace/orpc-contract";

export function useUsers(input: ListUsersInputType = {}) {
  const client = useUsersClient();
  return useQuery(client.listUsers.queryOptions({ input: { query: input } }));
}

export function useMe() {
  const client = useUsersClient();
  return useQuery(client.getMe.queryOptions());
}

export function useUpdateMe() {
  const client = useUsersClient();
  const { invalidateAll, invalidateAllUsers, invalidateMe } =
    useUsersQueryInvalidation();

  return useMutation(
    client.updateMe.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllUsers();
        invalidateMe();
      },
    })
  );
}

export function useCreateUser() {
  const client = useUsersClient();
  const { invalidateAll, invalidateAllUsers } = useUsersQueryInvalidation();

  return useMutation(
    client.createUser.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllUsers();
      },
    })
  );
}

export function useDeleteUser() {
  const client = useUsersClient();
  const { invalidateAllUsers } = useUsersQueryInvalidation();

  return useMutation(
    client.deleteUser.mutationOptions({
      onSuccess: () => {
        invalidateAllUsers();
      },
    })
  );
}
