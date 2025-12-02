import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRoleInputType,
  UpdateRoleInputType,
  createRoleSchema,
  updateRoleSchema,
  RoleOutputSchema,
} from "@workspace/orpc-contract";
import { z } from "zod";

// Define the extended type for RoleOutput that includes permissions
export type RoleOutputWithPermissions = z.infer<typeof RoleOutputSchema>;

const defaultCreateValues: CreateRoleInputType = {
  name: "",
  label: "",
  description: "",
  permissions: [],
};

const mapRoleOutputToInput = (
  role: RoleOutputWithPermissions
): UpdateRoleInputType => {
  return {
    name: role.name,
    label: role.label || undefined,
    description: role.description || undefined,
    permissions: role.rolePerms?.map((rp) => rp.permissionId) || [],
  };
};

interface UseRoleFormProps {
  mode: "create" | "edit";
  initialData?: UpdateRoleInputType | RoleOutputWithPermissions;
}

type RoleFormData = CreateRoleInputType | UpdateRoleInputType;

export const useRoleForm = ({ mode, initialData }: UseRoleFormProps) => {
  if (mode === "create") {
    const form = useForm<CreateRoleInputType>({
      resolver: zodResolver(createRoleSchema),
      defaultValues: defaultCreateValues,
      mode: "onChange",
    });

    return {
      form: form as UseFormReturn<RoleFormData>,
      mode: "create" as const,
    };
  } else {
    const transformedInitialData = initialData
      ? "id" in initialData
        ? mapRoleOutputToInput(initialData as RoleOutputWithPermissions)
        : (initialData as UpdateRoleInputType)
      : {};

    const form = useForm<UpdateRoleInputType>({
      resolver: zodResolver(updateRoleSchema),
      defaultValues: transformedInitialData,
      mode: "onChange",
    });

    useEffect(() => {
      form.reset(transformedInitialData);
    }, [initialData, form]);

    return {
      form: form as UseFormReturn<RoleFormData>,
      mode: "edit" as const,
    };
  }
};

export type UseRoleFormReturn = ReturnType<typeof useRoleForm>;
