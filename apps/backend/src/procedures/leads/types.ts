import { Inputs, Outputs } from "@/config/orpc";

export type CreateLeadInput = Inputs["leads"]["createLead"];
export type ListLeadsInput = Inputs["leads"]["listLeads"];
export type GetLeadByIdInput = Inputs["leads"]["getLeadById"];
export type UpdateLeadInput = Inputs["leads"]["updateLead"];
export type DeleteLeadInput = Inputs["leads"]["deleteLead"];
export type BulkDeleteLeadsInput = Inputs["leads"]["bulkDeleteLeads"];
export type ConvertLeadToCustomerInput = Inputs["leads"]["convertLeadToCustomer"];
export type BulkConvertLeadToCustomerInput = Inputs["leads"]["bulkConvertLeadToCustomer"];

export type AddLeadNoteInput = Inputs["leads"]["addLeadNote"];
export type UpdateLeadNoteInput = Inputs["leads"]["updateLeadNote"];
export type AddLeadLogInput = Inputs["leads"]["addLeadLog"];
export type UpdateLeadLogInput = Inputs["leads"]["updateLeadLog"];
export type AddLeadTaskInput = Inputs["leads"]["addLeadTask"];
export type UpdateLeadTaskInput = Inputs["leads"]["updateLeadTask"];

export type LeadOutput = Outputs["leads"]["createLead"];
export type ListLeadsOutput = Outputs["leads"]["listLeads"];
export type LeadNoteOutput = Outputs["leads"]["addLeadNote"];
export type LeadLogOutput = Outputs["leads"]["addLeadLog"];
export type LeadTaskOutput = Outputs["leads"]["addLeadTask"];
export type CustomerOutput = Outputs["leads"]["convertLeadToCustomer"];
