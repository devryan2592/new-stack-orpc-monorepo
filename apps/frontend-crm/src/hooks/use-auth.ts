"use client";

import { useMe } from "@workspace/orpc-client";
import { UserOutputSchema } from "@workspace/orpc-contract";
import { z } from "zod";

export type AuthUser = z.infer<typeof UserOutputSchema>;

export function useAuth() {
  const { data: response, isLoading, error, refetch } = useMe();

  const user = response?.data;
  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    refetch,
  };
}
