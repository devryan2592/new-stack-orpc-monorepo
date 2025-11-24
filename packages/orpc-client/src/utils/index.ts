"use client";

import { useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/server-caller";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export function useORPC() {
  return createTanstackQueryUtils(client);
}

export function usePermissionsClient() {
  return createTanstackQueryUtils(client.permissions, {
    path: ["permissions"],
  });
}

export function usePermissionsQueryInvalidator() {
  const permissionsClient = usePermissionsClient();

  return;
}

//  Roles CLient

//  Users Client
