"use client";

import { useState, useEffect } from "react";
import { authClient } from "../client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const { data: session, error } = await authClient.getSession();

      if (error || !session) {
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }

      const userData: AuthUser = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image || undefined,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      };

      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    loadUser,
    setUser,
  };
}
