"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  UpdateProfileInputType,
} from "@workspace/orpc-contract";
import { useUpdateMe } from "@workspace/orpc-client";
import { useAuth } from "@/hooks/use-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { FC, useEffect } from "react";
import { toast } from "sonner";
import AvatarInput from "@workspace/ui/custom/avatar-input";
import { Card, CardContent } from "@workspace/ui/components/card";

interface ProfileFormProps {
  // Add your props here
}

const ProfileForm: FC<ProfileFormProps> = () => {
  const { user: UserData, isLoading, refetch } = useAuth();
  const updateMe = useUpdateMe();

  const form = useForm<UpdateProfileInputType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      image: "",
    },
  });

  useEffect(() => {
    if (UserData) {
      form.reset({
        image: UserData.image || "",
      });
    }
  }, [UserData, form]);

  const onSubmit = (data: UpdateProfileInputType) => {
    updateMe.mutate(
      { body: { image: data.image } },
      {
        onSuccess: () => {
          toast.success("Profile image updated successfully");
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to update profile image: " + error.message);
        },
      }
    );
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <Card className="p-0 ">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center gap-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col items-center">
                    <FormControl>
                      <AvatarInput
                        value={field.value}
                        onChange={(file) => {
                          if (file) {
                            toast.info(
                              "Image upload not implemented yet. Please provide a URL."
                            );
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
                <h3 className="font-medium text-lg">{UserData?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {UserData?.email}
                </p>
              </div>
              <div className="w-full pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span>
                    {UserData?.createdAt
                      ? new Date(UserData.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Updated</span>
                  <span>
                    {UserData?.updatedAt
                      ? new Date(UserData.updatedAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
