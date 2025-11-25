"use client";

import { useQuery } from "@tanstack/react-query";
import { usePermissionsClient } from "../utils";

export function usePermissions() {
  const client = usePermissionsClient();
  return useQuery(client.list.queryOptions());
}
