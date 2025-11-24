"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { usePermissionsClient } from "../utils";
import { toast } from "sonner";

export function usePermissions() {
  const client = usePermissionsClient();
  return useQuery(client.listPermissions.queryOptions());
}

export function useUpdateUserPermissions() {
  const client = usePermissionsClient();

  return useMutation(
    client.updateUserPermissions.mutationOptions({
      onSuccess: () => {
        toast.success("Permissions updated successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update permissions");
      },
    })
  );
}
