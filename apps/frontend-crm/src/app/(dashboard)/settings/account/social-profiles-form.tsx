"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateProfileInputSchema,
  UpdateProfileInput,
} from "@workspace/orpc-contract/inputs/profile";
import { useUpdateMe, useMe } from "@workspace/orpc-client";
import { Form } from "@workspace/ui/components/form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/field";
import { Controller } from "react-hook-form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export function SocialProfilesForm() {
  const { data: user, isLoading, refetch } = useMe();
  const updateMe = useUpdateMe();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileInputSchema),
    defaultValues: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        facebook: user.facebook || "",
        instagram: user.instagram || "",
        twitter: user.twitter || "",
        linkedin: user.linkedin || "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: UpdateProfileInput) => {
    updateMe.mutate(
      { body: data },
      {
        onSuccess: () => {
          toast.success("Social profiles updated successfully");
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to update social profiles: " + error.message);
        },
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Profiles</CardTitle>
        <CardDescription>Connect your social media accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <div className="grid gap-6 md:grid-cols-2 items-start">
                <Field>
                  <FieldLabel>Facebook</FieldLabel>
                  <Controller
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <Input placeholder="Facebook profile URL" {...field} />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.facebook]} />
                </Field>
                <Field>
                  <FieldLabel>Instagram</FieldLabel>
                  <Controller
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <Input placeholder="Instagram profile URL" {...field} />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.instagram]} />
                </Field>
                <Field>
                  <FieldLabel>Twitter</FieldLabel>
                  <Controller
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <Input placeholder="Twitter profile URL" {...field} />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.twitter]} />
                </Field>
                <Field>
                  <FieldLabel>LinkedIn</FieldLabel>
                  <Controller
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <Input placeholder="LinkedIn profile URL" {...field} />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.linkedin]} />
                </Field>
              </div>
            </FieldGroup>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={updateMe.isPending}>
                {updateMe.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
