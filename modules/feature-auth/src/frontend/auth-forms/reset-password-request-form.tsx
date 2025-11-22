"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";

import { Field, FieldLabel, FieldError, FieldGroup } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { AppButton } from "@workspace/ui/custom/app-button";
import { authClient } from "../client";

interface ResetPasswordRequestFormProps {
  updatePasswordUrl: string;
  loginUrl: string;
}

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const ResetPasswordRequestForm = ({
  updatePasswordUrl,
  loginUrl,
}: ResetPasswordRequestFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const redirectTo = new URL(
        updatePasswordUrl,
        window.location.origin
      ).toString();
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo,
      });

      if (error) {
        toast.error(
          error.message || "Failed to send reset link. Please try again."
        );
        return;
      }

      toast.success(
        "Password reset link sent! Check your email for instructions."
      );
      form.reset();
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                placeholder="Enter your email address"
                type="email"
                disabled={form.formState.isSubmitting}
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>
          </FieldGroup>
          <AppButton
            type="submit"
            className="w-full"
            loading={form.formState.isSubmitting}
          >
            Send Reset Link
          </AppButton>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Remember your password?{" "}
          <Link
            href={loginUrl}
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordRequestForm;
