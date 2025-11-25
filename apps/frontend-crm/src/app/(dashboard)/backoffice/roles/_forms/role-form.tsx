"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRoleInputSchema,
  UpdateRoleInputSchema,
} from "@workspace/orpc-contract/inputs/roles";
import { useCreateRole, useUpdateRole } from "@workspace/orpc-client";
import { usePermissions } from "@workspace/orpc-client";
import { Form } from "@workspace/ui/components/form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldDescription,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { AppButton } from "@workspace/ui/custom/app-button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

// Combined schema for form, handling both create and update needs
const roleFormSchema = CreateRoleInputSchema.extend({
  permissions: z.array(z.string()).default([]),
});

type RoleFormValues = z.input<typeof roleFormSchema>;

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
  const { data: permissionsData, isLoading: isLoadingPermissions } =
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

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Record<string, string>> = {};
    permissionsData?.data.forEach((p) => {
      const [feature, action] = p.name.split(":");
      if (feature && action) {
        if (!groups[feature]) groups[feature] = {};
        groups[feature][action] = p.id;
      }
    });
    return groups;
  }, [permissionsData]);

  const actions = ["create", "read", "update", "delete"];

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
        <FieldGroup>
          <Field>
            <FieldLabel>Role Name (Key)</FieldLabel>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="e.g. content_editor"
                  {...field}
                  disabled={!!role}
                />
              )}
            />
            <FieldDescription>
              Unique identifier for the role. Cannot be changed once created.
            </FieldDescription>
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field>
            <FieldLabel>Label</FieldLabel>
            <Controller
              control={form.control}
              name="label"
              render={({ field }) => (
                <Input
                  placeholder="e.g. Content Editor"
                  {...field}
                  value={field.value || ""}
                />
              )}
            />
            <FieldError errors={[form.formState.errors.label]} />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Textarea
                  placeholder="Describe the role's responsibilities"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              )}
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <div className="space-y-4">
            <FieldLabel>Permissions</FieldLabel>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    {actions.map((action) => (
                      <TableHead
                        key={action}
                        className="text-center capitalize"
                      >
                        {action}
                      </TableHead>
                    ))}
                    <TableHead className="text-center">All</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <Controller
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                      <>
                        {Object.entries(groupedPermissions).map(
                          ([feature, featurePermissions]) => {
                            const featurePermissionIds =
                              Object.values(featurePermissions);
                            const allSelected = featurePermissionIds.every(
                              (id) => field.value?.includes(id)
                            );

                            return (
                              <TableRow key={feature}>
                                <TableCell className="font-medium capitalize">
                                  {feature}
                                </TableCell>
                                {actions.map((action) => {
                                  const permissionId =
                                    featurePermissions[action];
                                  return (
                                    <TableCell
                                      key={action}
                                      className="text-center"
                                    >
                                      {permissionId && (
                                        <Checkbox
                                          checked={field.value?.includes(
                                            permissionId
                                          )}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              field.onChange([
                                                ...(field.value || []),
                                                permissionId,
                                              ]);
                                            } else {
                                              field.onChange(
                                                field.value?.filter(
                                                  (id) => id !== permissionId
                                                )
                                              );
                                            }
                                          }}
                                        />
                                      )}
                                    </TableCell>
                                  );
                                })}
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        const newPermissions = new Set([
                                          ...(field.value || []),
                                          ...featurePermissionIds,
                                        ]);
                                        field.onChange(
                                          Array.from(newPermissions)
                                        );
                                      } else {
                                        field.onChange(
                                          field.value?.filter(
                                            (id) =>
                                              !featurePermissionIds.includes(id)
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </>
                    )}
                  />
                </TableBody>
              </Table>
            </div>
          </div>
        </FieldGroup>

        <div className="flex justify-end">
          <AppButton type="submit" loading={isSubmitting}>
            {role ? "Update Role" : "Create Role"}
          </AppButton>
        </div>
      </form>
    </Form>
  );
}
