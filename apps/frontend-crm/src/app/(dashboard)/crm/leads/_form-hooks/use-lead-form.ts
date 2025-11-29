import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateLeadInput,
  UpdateLeadInput,
  CreateLeadInputType,
  UpdateLeadInputType,
  LeadOutput,
} from "@workspace/orpc-contract";
import { z } from "zod";

// Default values for create mode
const defaultCreateValues: CreateLeadInputType = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  leadType: "B2C",
  leadSource: "WEBSITE",
  status: "NEW",
  priority: "LOW",
  travelFrom: undefined,
  travelTo: undefined,
  travelStart: undefined,
  travelEnd: undefined,
  numberOfDays: undefined,
  numberOfAdults: undefined,
  numberOfChildren: undefined,
  numberOfInfants: undefined,
  tags: [],
  destinations: [],
  cities: [],
  companyName: undefined,
  whatsappNumber: undefined,
  requirements: undefined,
  budget: undefined,
  customerId: undefined,
  assignedToId: undefined,
};

// Helper function to map LeadOutput to UpdateLeadInputType
const mapLeadOutputToInput = (
  lead: z.infer<typeof LeadOutput>
): UpdateLeadInputType => {
  return {
    id: lead.id,
    firstName: lead.firstName || undefined,
    lastName: lead.lastName || undefined,
    email: lead.email || "",
    phone: lead.phone || undefined,
    leadType: lead.leadType,
    leadSource: lead.leadSource,
    status: lead.status,
    priority: lead.priority || undefined,
    travelFrom: lead.travelFrom || undefined,
    travelTo: lead.travelTo || undefined,
    travelStart: lead.travelStart
      ? new Date(lead.travelStart).toISOString()
      : undefined,
    travelEnd: lead.travelEnd
      ? new Date(lead.travelEnd).toISOString()
      : undefined,
    numberOfDays: lead.numberOfDays || undefined,
    numberOfAdults: lead.numberOfAdults || undefined,
    numberOfChildren: lead.numberOfChildren || undefined,
    numberOfInfants: lead.numberOfInfants || undefined,
    tags: lead.tags || [],
    destinations: lead.destinations || [],
    cities: lead.cities || [],
    companyName: lead.companyName || undefined,
    whatsappNumber: lead.whatsappNumber || undefined,
    requirements: lead.requirements || undefined,
    budget: lead.budget || undefined,
    customerId: lead.customerId || undefined,
    assignedToId: lead.assignedToId || undefined,
  };
};

interface UseLeadFormProps {
  mode: "create" | "edit";
  initialData?: UpdateLeadInputType | z.infer<typeof LeadOutput>;
}

// Union type for form data
type LeadFormData = CreateLeadInputType | UpdateLeadInputType;

export const useLeadForm = ({ mode, initialData }: UseLeadFormProps) => {
  if (mode === "create") {
    const form = useForm<CreateLeadInputType>({
      resolver: zodResolver(CreateLeadInput),
      defaultValues: defaultCreateValues,
      mode: "onChange",
    });

    return {
      form: form as UseFormReturn<LeadFormData>,
      mode: "create" as const,
    };
  } else {
    // Transform initialData if it's a LeadOutput (from API)
    const transformedInitialData = initialData
      ? "createdAt" in initialData
        ? mapLeadOutputToInput(initialData as z.infer<typeof LeadOutput>)
        : (initialData as UpdateLeadInputType)
      : {};

    const form = useForm<UpdateLeadInputType>({
      resolver: zodResolver(UpdateLeadInput),
      defaultValues: transformedInitialData,
      mode: "onChange",
    });

    useEffect(() => {
      form.reset(transformedInitialData);
    }, [initialData, form]);

    return {
      form: form as UseFormReturn<LeadFormData>,
      mode: "edit" as const,
    };
  }
};

export type UseLeadFormReturn = ReturnType<typeof useLeadForm>;
