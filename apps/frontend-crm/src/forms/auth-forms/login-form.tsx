"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AppButton } from "@workspace/ui/custom/app-button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { PasswordInput } from "@workspace/ui/custom/password-input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface LoginFormProps {
  dashboardUrl: string;
  registerUrl: string;
  resetPasswordUrl: string;
}

// Auth Schema
const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormInput = z.infer<typeof LoginSchema>;

const LoginForm: FC<LoginFormProps> = ({
  dashboardUrl,
  registerUrl,
  resetPasswordUrl,
}) => {
  const router = useRouter();

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "test@test.com",
      password: "testing@123",
    },
  });

  const {
    formState: { isSubmitting, errors },
    setError,
  } = form;

  async function onSubmit(data: LoginFormInput) {
    try {
      const response = await authClient.signIn.email(data);

      if (response.error) {
        toast.error(response.error.message || "Invalid email or password");
        setError("root.apiError", {
          message: response.error.message || "Invalid email or password",
        });
      } else {
        toast.success("Successfully signed in! Welcome back.");

        // Redirect to dashboard after 3000ms delay
        setTimeout(() => {
          router.push(dashboardUrl);
        }, 1000);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setError("root.apiError", {
        message: "An error occurred. Please try again.",
      });
    }
  }

  console.log(errors);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="">
        <CardTitle className="text-2xl font-bold ">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {form.formState.errors.root?.apiError && (
          <div className="border border-destructive/10 bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-md mb-4">
            {form.formState.errors.root.apiError.message}
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                placeholder="email@example.com"
                type="email"
                autoComplete="email"
                disabled={isSubmitting}
                {...form.register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Controller
                control={form.control}
                name="password"
                render={({ field }) => (
                  <PasswordInput
                    disabled={isSubmitting}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError errors={[errors.password]} />
              <div className="flex justify-end ">
                <Link
                  href={resetPasswordUrl}
                  className="text-sm text-muted-foreground hover:text-primary duration-200 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </Field>
          </FieldGroup>
          <AppButton className="w-full" type="submit" loading={isSubmitting}>
            Sign In
          </AppButton>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={registerUrl}
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
