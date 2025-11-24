"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { usePermissionsClient } from "../utils";
import { toast } from "sonner";

export function usePermissions() {
  const client = usePermissionsClient();
  return useQuery(client.listPermissions.queryOptions());
}
