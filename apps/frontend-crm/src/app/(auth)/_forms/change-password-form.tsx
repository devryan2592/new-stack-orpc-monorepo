"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { PasswordInput } from "@workspace/ui/custom/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { AppButton } from "@workspace/ui/custom/app-button";
import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ChangePasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting, errors },
    setError,
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await authClient.changePassword({
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
        revokeOtherSessions: true, // Optional, maybe make it a checkbox?
      });

      if (error) {
        toast.error(
          error.message ||
            "Failed to change password. Please check your current password."
        );
        return;
      }

      toast.success("Password changed successfully");
      form.reset();
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Current Password</FieldLabel>
              <Controller
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <PasswordInput
                    placeholder="Enter current password"
                    disabled={isSubmitting}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError errors={[form.formState.errors.currentPassword]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Controller
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <PasswordInput
                    placeholder="Enter new password"
                    disabled={isSubmitting}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError errors={[form.formState.errors.newPassword]} />
            </Field>
            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <PasswordInput
                    placeholder="Confirm new password"
                    disabled={isSubmitting}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </Field>
          </FieldGroup>
          <div className="flex justify-end">
            <AppButton type="submit" loading={form.formState.isSubmitting}>
              Change Password
            </AppButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
