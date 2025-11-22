"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { AppButton } from "@workspace/ui/custom/app-button";
import { authClient } from "../client";

enum VerificationStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

interface VerifyEmailFormProps {
  loginUrl: string;
}

export function VerifyEmailForm({ loginUrl }: VerifyEmailFormProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerificationStatus>(
    VerificationStatus.LOADING
  );
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus(VerificationStatus.ERROR);
        setError(
          "Verification token is missing. Please check your email link and try again."
        );
        toast.error(
          "Verification token is missing. Please check your email link."
        );
        return;
      }

      try {
        const response = await authClient.verifyEmail({
          query: { token },
        });

        if (response.error) {
          setStatus(VerificationStatus.ERROR);
          let errorMessage = "Failed to verify email. Please try again.";
          if (response.error.message?.includes("expired")) {
            errorMessage =
              "Your verification link has expired. Please request a new verification email.";
          } else if (response.error.message?.includes("invalid")) {
            errorMessage =
              "Invalid verification link. Please check your email and try again.";
          } else if (response.error.message?.includes("already")) {
            errorMessage =
              "This email has already been verified. You can now sign in to your account.";
          } else if (response.error.message) {
            errorMessage = response.error.message;
          }
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setStatus(VerificationStatus.SUCCESS);
          toast.success(
            "Email verified successfully! You can now sign in to your account."
          );
        }
      } catch (error) {
        setStatus(VerificationStatus.ERROR);
        setError(
          "An unexpected error occurred during verification. Please try again or contact support if the problem persists."
        );
        toast.error(
          "An unexpected error occurred during verification. Please try again."
        );
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (status === VerificationStatus.SUCCESS && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, countdown]);

  const handleResendVerification = async () => {
    try {
      toast.info("Please check your email for a new verification link.");
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    }
  };

  if (status === VerificationStatus.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-center text-muted-foreground">
          Verifying your email address...
        </p>
      </div>
    );
  }

  if (status === VerificationStatus.SUCCESS) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="rounded-full bg-green-100 p-3">✓</div>
        <h2 className="text-2xl font-bold text-center">Email Verified!</h2>
        <p className="text-center text-muted-foreground">
          Your email has been successfully verified. You can now sign in to your
          account.
        </p>
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Redirecting to login page in {countdown} seconds...
          </p>
          <Link
            href={loginUrl}
            className="text-xs text-primary hover:underline inline-block"
          >
            Click here to go to login page manually
          </Link>
        </div>
      </div>
    );
  }

  if (status === VerificationStatus.ERROR) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="rounded-full bg-red-100 p-3">✕</div>
        <h2 className="text-2xl font-bold text-center">Verification Failed</h2>
        <p className="text-center text-destructive max-w-md">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <AppButton onClick={handleResendVerification} variant="outline">
            Resend Verification Email
          </AppButton>
          <Link href={loginUrl}>
            <AppButton variant="default">Go to Login</AppButton>
          </Link>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team or try signing up again.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default VerifyEmailForm;
