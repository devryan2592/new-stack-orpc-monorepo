"use client";

import { useMe } from "@workspace/orpc-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_LINKS } from "@/lib/links";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  roles?: { id: string; name: string }[];
}

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useMe();
  const router = useRouter();

  const isAuthenticated = !!user;

  return {
    user: user as AuthUser | undefined,
    isLoading,
    isAuthenticated,
    error,
    refetch,
  };
}
