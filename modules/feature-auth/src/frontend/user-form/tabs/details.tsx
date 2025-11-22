"use client";

import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { PasswordInput } from "@workspace/ui/custom/password-input";
import { Controller, useFormContext } from "react-hook-form";
import { UserFormValues } from "../types";

export const DetailsTab: FC = () => {
  const { control } = useFormContext<UserFormValues>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="Full name" />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </>
              )}
            />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="user@example.com" />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </>
              )}
            />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <PasswordInput value={field.value} onChange={field.onChange} />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </>
              )}
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};