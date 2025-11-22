"use client";

import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Controller, useFormContext } from "react-hook-form";
import { UserFormValues } from "../types";

export const StatusTab: FC = () => {
  const { control } = useFormContext<UserFormValues>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Banned</FieldLabel>
            <Controller
              name="banned"
              control={control}
              render={({ field }) => (
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange as any} />
              )}
            />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Ban Reason</FieldLabel>
            <Controller
              name="banReason"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="Reason" />
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