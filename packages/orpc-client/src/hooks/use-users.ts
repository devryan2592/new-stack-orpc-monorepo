"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useUsersClient, useUsersQueryInvalidation } from "../utils";
import { ListUsersInput } from "@workspace/orpc-contract/inputs/users";
import { toast } from "sonner";

export function useUsers(input: ListUsersInput = {}) {
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
        toast.success("Profile updated successfully");
        invalidateAll();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
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
        toast.success("User created successfully");
        invalidateAll();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create user");
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
        toast.success("User deleted successfully");
        invalidateAll();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete user");
      },
    })
  );
}
