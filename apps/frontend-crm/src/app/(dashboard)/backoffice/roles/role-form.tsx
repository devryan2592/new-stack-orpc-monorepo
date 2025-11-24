"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRoleInput,
  UpdateRoleInput,
} from "@workspace/orpc-contract/inputs/roles";
import {
  useCreateRole,
  useUpdateRole,
} from "@workspace/orpc-client/hooks/use-roles";
import { usePermissions } from "@workspace/orpc-client/hooks/use-permissions";
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
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useEffect } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";

// Combined schema for form, handling both create and update needs
const roleFormSchema = CreateRoleInput.extend({
  permissions: z.array(z.string()).default([]),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  role?: {
    id: string;
    name: string;
    label?: string | null;
    description?: string | null;
    rolePerms?: { permissionId: string }[];
  };
  onSuccess?: () => void;
}

export function RoleForm({ role, onSuccess }: RoleFormProps) {
  const { data: permissions, isLoading: isLoadingPermissions } =
    usePermissions();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      label: "",
      description: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        label: role.label || "",
        description: role.description || "",
        permissions: role.rolePerms?.map((rp) => rp.permissionId) || [],
      });
    }
  }, [role, form]);

  const onSubmit = (data: RoleFormValues) => {
    if (role) {
      updateRole.mutate(
        {
          params: { id: role.id },
          body: data,
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createRole.mutate(
        { body: data },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    }
  };

  const isSubmitting = createRole.isPending || updateRole.isPending;

  if (isLoadingPermissions) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name (Key)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. content_editor"
                  {...field}
                  disabled={!!role}
                />
              </FormControl>
              <FormDescription>
                Unique identifier for the role. Cannot be changed once created.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Content Editor"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role's responsibilities"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Permissions</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg max-h-[300px] overflow-y-auto">
            {permissions?.map((permission) => (
              <FormField
                key={permission.id}
                control={form.control}
                name="permissions"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={permission.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, permission.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== permission.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{permission.name}</FormLabel>
                        {permission.description && (
                          <FormDescription>
                            {permission.description}
                          </FormDescription>
                        )}
                      </div>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {role ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
