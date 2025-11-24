"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { DASHBOARD_LINKS } from "@/lib/links";
import { Loader2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(DASHBOARD_LINKS.HOME);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className=" flex items-center justify-center h-screen px-2 ">
      {children}
    </main>
  );
}
