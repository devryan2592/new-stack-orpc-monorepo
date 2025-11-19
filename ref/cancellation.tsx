"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { FC } from "react";
import { FileText } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { FormValueType } from "../types";
import ArrayInput from "@/components/app-ui/array-input";

interface CancellationTabProps {
  children?: React.ReactNode;
}

const CancellationTab: FC<CancellationTabProps> = ({ children }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValueType>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Cancellation Policy
        </CardTitle>
        <CardDescription>
          Define cancellation policy statements for this attraction booking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="space-y-6">
          <Field>
            <FieldLabel htmlFor="cancellationPolicy">
              Cancellation Policy
            </FieldLabel>
            <Controller
              name="cancellationPolicy"
              control={control}
              render={({ field }) => (
                <ArrayInput
                  value={field.value || []}
                  onChange={field.onChange}
                  className="bg-blue-50/20 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800"
                  placeholder="Add a cancellation policy statement"
                />
              )}
            />
            <FieldDescription>
              Provide clear cancellation policy points (e.g., timelines, fees,
              non-refundable conditions) relevant to this attraction.
            </FieldDescription>
            <FieldError
              errors={
                errors.cancellationPolicy
                  ? [errors.cancellationPolicy]
                  : undefined
              }
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};

export default CancellationTab;
