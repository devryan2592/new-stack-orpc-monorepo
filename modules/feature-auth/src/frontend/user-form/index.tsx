"use client";

import { FC, useMemo, useState } from "react";
import { Card } from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormValues } from "./types";
import { DetailsTab } from "./tabs/details";
import { RolesTab } from "./tabs/roles";
import { StatusTab } from "./tabs/status";
import { admin } from "../client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AppButton } from "@workspace/ui/custom/app-button";

interface UserFormProps {
  onSuccess?: (data?: any) => void;
  onCancel?: () => void;
}

export const UserForm: FC<UserFormProps> = ({ onSuccess, onCancel }) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      banned: false,
      banReason: "",
    },
  });

  const [resetKey, setResetKey] = useState<string>(crypto.randomUUID());

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = form;

  const hasTabErrors = (tabName: string) => {
    switch (tabName) {
      case "details":
        return !!(errors.name || errors.email || errors.password);
      case "roles":
        return !!errors.role;
      case "status":
        return !!(errors.banned || errors.banReason);
      default:
        return false;
    }
  };

  const tabs = useMemo(
    () => [
      { value: "details", label: "Details", component: <DetailsTab /> },
      { value: "roles", label: "Roles", component: <RolesTab /> },
      { value: "status", label: "Status", component: <StatusTab /> },
    ],
    []
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { data: created, error } = await (admin as any).createUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        data: {
          banned: data.banned,
          banReason: data.banReason,
        },
      });
      if (error) throw error;
      toast.success("User created successfully");
      onSuccess?.(created);
    } catch (e: any) {
      console.error("User creation error:", e);
      toast.error(e?.message || "Failed to create user");
    }
  });

  const handleReset = () => {
    reset();
    setResetKey(crypto.randomUUID());
    toast.info("Form has been reset");
  };

  const isLoading = isSubmitting;

  return (
    <FormProvider {...form}>
      <Tabs
        defaultValue="details"
        className="flex flex-col flex-1 px-1 py-0 overflow-hidden"
      >
        <Card className="rounded-none p-2 shrink-0 overflow-x-auto">
          <TabsList className="gap-2 bg-card flex-nowrap min-w-max h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                className={`h-9 justify-start data-[state=active]:bg-secondary data-[state=active]:text-primary text-muted-foreground ${hasTabErrors(tab.value) ? "border-destructive border-2" : ""}`}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Card>

        <Card className="p-2 flex-1 overflow-hidden">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="h-full overflow-y-auto m-0"
            >
              {tab.component}
            </TabsContent>
          ))}
        </Card>
      </Tabs>

      <div className="flex items-center justify-end gap-2">
        <AppButton
          type="button"
          variant="outline"
          className="min-w-32"
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset Form
        </AppButton>
        <AppButton
          type="submit"
          disabled={isLoading}
          className="min-w-32"
          onClick={onSubmit}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create User
        </AppButton>
      </div>
    </FormProvider>
  );
};

export default UserForm;
