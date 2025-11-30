import { UseCustomerFormReturn } from "../_form-hooks/use-customer-form";
import { Controller, useWatch } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { PhoneInput } from "@workspace/ui/custom/phone-input";
import { Label } from "@workspace/ui/components/label";

import { AppButton } from "@workspace/ui/custom/app-button";

interface CustomerFormProps {
  form: UseCustomerFormReturn["form"];
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export const CustomerForm = ({
  form,
  onSubmit,
  isSubmitting,
}: CustomerFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const type = useWatch({ control, name: "type" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup>
        {/* Type */}
        <Controller
          control={control}
          name="type"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Customer Type</FieldLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B2C" id="t1" />
                  <Label htmlFor="t1">B2C</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B2B_CORPORATE" id="t2" />
                  <Label htmlFor="t2">B2B Corporate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B2B_AGENCY" id="t3" />
                  <Label htmlFor="t3">B2B Agency</Label>
                </div>
              </RadioGroup>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* Company Details */}
        {(type === "B2B_CORPORATE" || type === "B2B_AGENCY") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              control={control}
              name="companyName"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Company Name</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Company Name"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="gstNumber"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>GST Number</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="GST Number"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="vatNumber"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>VAT Number</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="VAT Number"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        )}

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="firstName"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="John"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input {...field} value={field.value || ""} placeholder="Doe" />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  type="email"
                  placeholder="john@example.com"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter phone number"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
        <Controller
          control={control}
          name="alternatePhone"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Alternate Phone</FieldLabel>
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Enter alternate phone"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* Other Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Date of Birth</FieldLabel>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? field.value.split("T")[0] : ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined
                    )
                  }
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="nationality"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Nationality</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Nationality"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        {/* Passport */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="passportNumber"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Passport Number</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Passport Number"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="passportExpiry"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Passport Expiry</FieldLabel>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? field.value.split("T")[0] : ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined
                    )
                  }
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        {/* Address */}
        <FieldGroup>
          <Controller
            control={control}
            name="address"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Address</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Address"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="city"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>City</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="City"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="country"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Country"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </FieldGroup>

      <AppButton
        className="w-full md:w-60"
        type="submit"
        loading={isSubmitting}
      >
        Save Customer
      </AppButton>
    </form>
  );
};
