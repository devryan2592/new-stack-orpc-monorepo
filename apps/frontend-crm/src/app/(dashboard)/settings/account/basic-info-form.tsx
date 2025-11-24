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
import { Textarea } from "@workspace/ui/components/textarea";
import { useEffect } from "react";
import { toast } from "sonner";
import { PhoneInput } from "@workspace/ui/custom/phone-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card";

export function BasicInfoForm() {
  const { data: user, isLoading, refetch } = useMe();
  const updateMe = useUpdateMe();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileInputSchema),
    defaultValues: {
      name: "",
      phone: "",
      altPhone: "",
      bio: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        altPhone: user.altPhone || "",
        bio: user.bio || "",
        address: user.address || "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: UpdateProfileInput) => {
    updateMe.mutate(
      { body: data },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to update profile: " + error.message);
        },
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>View and update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <div className="grid gap-6 md:grid-cols-2 items-start">
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <Input placeholder="Your name" {...field} />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.name]} />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input value={user?.email || ""} disabled />
                  <p className="text-xs text-indigo-400 mt-1">
                    Email cannot be changed.
                  </p>
                </Field>
              </div>

              <div className="grid gap-6 md:grid-cols-2 items-start">
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneInput
                        value={field.value as any}
                        onChange={(value) => field.onChange(value || "")}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        defaultCountry="US"
                      />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.phone]} />
                </Field>
                <Field>
                  <FieldLabel>Alternative Phone</FieldLabel>
                  <Controller
                    control={form.control}
                    name="altPhone"
                    render={({ field }) => (
                      <PhoneInput
                        value={field.value as any}
                        onChange={(value) => field.onChange(value || "")}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        defaultCountry="US"
                      />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.altPhone]} />
                </Field>
              </div>

              <Field>
                <FieldLabel>Bio</FieldLabel>
                <Controller
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <Textarea
                      placeholder="Tell us about yourself"
                      className="resize-none"
                      {...field}
                    />
                  )}
                />
                <FieldError errors={[form.formState.errors.bio]} />
              </Field>

              <Field>
                <FieldLabel>Address</FieldLabel>
                <Controller
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <Input placeholder="Your address" {...field} />
                  )}
                />
                <FieldError errors={[form.formState.errors.address]} />
              </Field>
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
