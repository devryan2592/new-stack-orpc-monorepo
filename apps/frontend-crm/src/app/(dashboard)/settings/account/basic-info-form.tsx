"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateProfileInputSchema,
  UpdateProfileInput,
} from "@workspace/orpc-contract/inputs/profile";
import { useUpdateMe, useMe } from "@workspace/orpc-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@workspace/ui/components/form";
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 items-start">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={user?.email || ""} disabled />
                </FormControl>
                <FormDescription className="text-xs text-indigo-400">
                  Email cannot be changed.
                </FormDescription>
              </FormItem>
            </div>

            <div className="grid gap-4 md:grid-cols-2 items-start">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value as any}
                        onChange={(value) => field.onChange(value || "")}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        defaultCountry="US"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="altPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternative Phone</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value as any}
                        onChange={(value) => field.onChange(value || "")}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        defaultCountry="US"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
