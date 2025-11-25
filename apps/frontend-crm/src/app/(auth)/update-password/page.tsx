"use client";

import { Metadata } from "next";
import { useSearchParams } from "next/navigation";
import { UpdatePasswordForm } from "@/app/(auth)/_forms";
import { AUTH_LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Update Password",
  description: "Enter your new password to complete the update",
};

export default function UpdatePasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") ?? undefined;

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>
          <div className="flex flex-col space-y-3 mt-6">
            <a
              href={AUTH_LINKS.RESET_PASSWORD}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
            >
              Request New Reset Link
            </a>
            <a
              href={AUTH_LINKS.LOGIN}
              className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
            >
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <UpdatePasswordForm token={token} loginUrl={AUTH_LINKS.LOGIN} />;
}
