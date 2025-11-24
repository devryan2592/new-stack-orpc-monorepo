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
} from "@workspace/ui/components/form";
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 items-start">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="Facebook profile URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="Instagram profile URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="Twitter profile URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="LinkedIn profile URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
