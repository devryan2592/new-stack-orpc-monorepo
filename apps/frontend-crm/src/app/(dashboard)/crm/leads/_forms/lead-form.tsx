import { UseLeadFormReturn } from "../_form-hooks/use-lead-form";
import { Controller, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
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
import { Checkbox } from "@workspace/ui/components/checkbox";
import { AppButton } from "@workspace/ui/custom/app-button";
import { PhoneInput } from "@workspace/ui/custom/phone-input";
import ArrayInput from "@workspace/ui/custom/array-input";
import PositiveNumberInput from "@workspace/ui/custom/positive-number-input";
import { Label } from "@workspace/ui/components/label";
import { CreateLeadInput, UpdateLeadInput } from "@workspace/orpc-contract";

interface LeadFormProps {
  form: UseLeadFormReturn["form"];
  onSubmit: (data: CreateLeadInput | UpdateLeadInput) => void;
  isSubmitting?: boolean;
}

export const LeadForm = ({ form, onSubmit, isSubmitting }: LeadFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const leadType = useWatch({ control, name: "leadType" });
  const phone = useWatch({ control, name: "phone" });
  const [sameAsPhone, setSameAsPhone] = useState(false);

  useEffect(() => {
    if (sameAsPhone) {
      setValue("whatsappNumber", phone);
    }
  }, [sameAsPhone, phone, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup>
        {/* 1. Lead Type */}
        <Controller
          control={control}
          name="leadType"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Lead Type</FieldLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B2C" id="r1" />
                  <Label htmlFor="r1">B2C</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B2B_CORPORATE" id="r2" />
                  <Label htmlFor="r2">B2B Corporate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B2B_AGENCY" id="r3" />
                  <Label htmlFor="r3">B2B Agency</Label>
                </div>
              </RadioGroup>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* 1.1 Company Name */}
        {(leadType === "B2B_CORPORATE" || leadType === "B2B_AGENCY") && (
          <Controller
            control={control}
            name="companyName"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Company Name</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Enter company name"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        )}

        {/* 2. First Name & Last Name */}
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

        {/* 3. Contact & Whatsapp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Contact Number</FieldLabel>
                <PhoneInput
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Enter phone number"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <div className="space-y-2">
            <Controller
              control={control}
              name="whatsappNumber"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Whatsapp Number</FieldLabel>
                  <PhoneInput
                    value={field.value || undefined}
                    onChange={field.onChange}
                    placeholder="Enter whatsapp number"
                    disabled={sameAsPhone}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAsPhone"
                checked={sameAsPhone}
                onCheckedChange={(checked) => setSameAsPhone(checked === true)}
              />
              <Label
                htmlFor="sameAsPhone"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Same as contact number
              </Label>
            </div>
          </div>
        </div>

        {/* 4. Email */}
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
                placeholder="john.doe@example.com"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* 5. Status, Source, Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            control={control}
            name="status"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                    <SelectItem value="POTENTIAL">Potential</SelectItem>
                    <SelectItem value="POSITIVE">Positive</SelectItem>
                    <SelectItem value="CONVERTED">Converted</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="leadSource"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Source</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEBSITE">Website</SelectItem>
                    <SelectItem value="REFERRAL">Referral</SelectItem>
                    <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                    <SelectItem value="CAMPAIGN">Campaign</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="priority"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Priority</FieldLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        {/* 6. Travel From & To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="travelFrom"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Travel From</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="City/Country"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="travelTo"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Travel To</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="City/Country"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        {/* 6.1 Travel Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="travelStart"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Travel Start</FieldLabel>
                <Input
                  {...field}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(
                      val ? new Date(val).toISOString() : undefined
                    );
                  }}
                  type="datetime-local"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="travelEnd"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Travel End</FieldLabel>
                <Input
                  {...field}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(
                      val ? new Date(val).toISOString() : undefined
                    );
                  }}
                  type="datetime-local"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        {/* 7. Destinations & Cities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="destinations"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Destinations</FieldLabel>
                <ArrayInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add destination"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="cities"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Cities</FieldLabel>
                <ArrayInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add city"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        {/* 8. Requirements */}
        <Controller
          control={control}
          name="requirements"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Requirements</FieldLabel>
              <Textarea
                {...field}
                value={field.value || ""}
                placeholder="Enter requirements..."
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* 9. Duration & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="numberOfDays"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Duration (Days)</FieldLabel>
                <PositiveNumberInput
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="7"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="budget"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Budget</FieldLabel>
                <PositiveNumberInput
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Budget amount"
                  price
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        {/* 10. Travellers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            control={control}
            name="numberOfAdults"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Adults</FieldLabel>
                <PositiveNumberInput
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="2"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="numberOfChildren"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Children</FieldLabel>
                <PositiveNumberInput
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="0"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="numberOfInfants"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Infants</FieldLabel>
                <PositiveNumberInput
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="0"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        {/* 11. Tags */}
        <Controller
          control={control}
          name="tags"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Tags</FieldLabel>
              <ArrayInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add tag"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>

      <AppButton
        className="w-full md:w-60"
        type="submit"
        loading={isSubmitting}
      >
        Save Lead
      </AppButton>
    </form>
  );
};
