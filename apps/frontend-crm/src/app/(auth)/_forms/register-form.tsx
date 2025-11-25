"use client";

import { FC } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

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
import { authClient } from "@/lib/auth-client";

interface RegisterFormProps {
  loginUrl: string;
}

const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormInput = z.infer<typeof RegisterSchema>;

const RegisterForm: FC<RegisterFormProps> = ({ loginUrl }) => {
  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting },
    setError,
  } = form;

  async function onSubmit(data: RegisterFormInput) {
    try {
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (response.error) {
        toast.error(response.error.message || "Registration failed");
        setError("root.apiError", {
          message: response.error.message || "Registration failed",
        });
      } else {
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        form.reset();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setError("root.apiError", {
        message: "An error occurred. Please try again.",
      });
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        {form.formState.errors.root?.apiError && (
          <div className="border border-destructive/10 bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-md mb-4">
            {form.formState.errors.root.apiError.message}
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                autoComplete="name"
                disabled={isSubmitting}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
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
              <FieldError errors={[form.formState.errors.email]} />
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
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <PasswordInput
                    disabled={isSubmitting}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </Field>
          </FieldGroup>
          <AppButton type="submit" className="w-full" loading={isSubmitting}>
            Sign Up
          </AppButton>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
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

export default RegisterForm;
