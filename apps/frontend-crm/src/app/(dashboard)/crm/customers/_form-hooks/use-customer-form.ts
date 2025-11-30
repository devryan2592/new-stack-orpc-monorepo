import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCustomerInputType,
  UpdateCustomerInputType,
  CustomerOutput,
  CustomerOutputType,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@workspace/orpc-contract";
import { z } from "zod";

// Default values for create mode
const defaultCreateValues: CreateCustomerInputType = {
  firstName: "",
  lastName: "",
  email: "",
  phone: undefined,
  alternatePhone: undefined,
  dateOfBirth: undefined,
  gender: undefined,
  nationality: undefined,
  passportNumber: undefined,
  passportExpiry: undefined,
  address: undefined,
  city: undefined,
  country: undefined,
  type: "B2C",
  companyName: undefined,
  gstNumber: undefined,
  vatNumber: undefined,
  familyMemberIds: [],
  associateIds: [],
  avatar: undefined,
};

// Helper function to map CustomerOutput to UpdateCustomerInputType
const mapCustomerOutputToInput = (
  customer: z.infer<typeof CustomerOutput>
): UpdateCustomerInputType => {
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email || "",
    phone: customer.phone || undefined,
    alternatePhone: customer.alternatePhone || undefined,
    dateOfBirth: customer.dateOfBirth
      ? new Date(customer.dateOfBirth).toISOString()
      : undefined,
    gender: customer.gender || undefined,
    nationality: customer.nationality || undefined,
    passportNumber: customer.passportNumber || undefined,
    passportExpiry: customer.passportExpiry
      ? new Date(customer.passportExpiry).toISOString()
      : undefined,
    address: customer.address || undefined,
    city: customer.city || undefined,
    country: customer.country || undefined,
    type: customer.type,
    companyName: customer.companyName || undefined,
    gstNumber: customer.gstNumber || undefined,
    vatNumber: customer.vatNumber || undefined,
    avatar: customer.avatar || undefined,
    // For relations, we map them to IDs if they exist
    familyMemberIds: customer.familyMembers?.map((m) => m.id) || [],
    associateIds: customer.associates?.map((a) => a.id) || [],
  };
};

interface UseCustomerFormProps {
  mode: "create" | "edit";
  initialData?: UpdateCustomerInputType | CustomerOutputType;
}

// Union type for form data
type CustomerFormData = CreateCustomerInputType | UpdateCustomerInputType;

export const useCustomerForm = ({
  mode,
  initialData,
}: UseCustomerFormProps) => {
  if (mode === "create") {
    const form = useForm<CreateCustomerInputType>({
      resolver: zodResolver(CreateCustomerInput),
      defaultValues: defaultCreateValues,
      mode: "onChange",
    });

    return {
      form: form as UseFormReturn<CustomerFormData>,
      mode: "create" as const,
    };
  } else {
    // Transform initialData if it's a CustomerOutput (from API)
    const transformedInitialData = initialData
      ? "createdAt" in initialData
        ? mapCustomerOutputToInput(
            initialData as z.infer<typeof CustomerOutput>
          )
        : (initialData as UpdateCustomerInputType)
      : {};

    const form = useForm<UpdateCustomerInputType>({
      resolver: zodResolver(UpdateCustomerInput),
      defaultValues: transformedInitialData,
      mode: "onChange",
    });

    useEffect(() => {
      form.reset(transformedInitialData);
    }, [initialData, form]);

    return {
      form: form as UseFormReturn<CustomerFormData>,
      mode: "edit" as const,
    };
  }
};

export type UseCustomerFormReturn = ReturnType<typeof useCustomerForm>;
