"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRolesClient, useRolesQueryInvalidation } from "../utils";
import { toast } from "sonner";

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
        toast.success("Role created successfully");
        invalidateAll();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create role");
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
        toast.success("Role updated successfully");
        invalidateAll();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update role");
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
        toast.success("Role deleted successfully");
        invalidateAll();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete role");
      },
    })
  );
}

export function useAssignRole() {
  const client = useRolesClient();

  return useMutation(
    client.assign.mutationOptions({
      onSuccess: () => {
        toast.success("Role assigned successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to assign role");
      },
    })
  );
}
