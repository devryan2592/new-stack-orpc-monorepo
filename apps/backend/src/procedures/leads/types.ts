import { Inputs, Outputs } from "@/config/orpc";

export type CreateLeadInput = Inputs["leads"]["createLead"];
export type ListLeadsInput = Inputs["leads"]["getAllLeads"];
export type UpdateLeadInput = Inputs["leads"]["updateLead"];
export type DeleteLeadInput = Inputs["leads"]["deleteLead"];
export type GetLeadByIdInput = Inputs["leads"]["getLeadById"];

export type LeadOutput = Outputs["leads"]["createLead"];
export type ListLeadsOutput = Outputs["leads"]["getAllLeads"];
export type GetLeadByIdOutput = Outputs["leads"]["getLeadById"];

export type CreateLeadNoteInput = Inputs["leads"]["addLeadNote"];
export type CreateLeadLogInput = Inputs["leads"]["addLeadLog"];
export type CreateLeadTaskInput = Inputs["leads"]["addLeadTask"];
export type UpdateLeadTaskInput = Inputs["leads"]["updateLeadTask"];

export type LeadNoteOutput = Outputs["leads"]["addLeadNote"];
export type LeadLogOutput = Outputs["leads"]["addLeadLog"];
export type LeadTaskOutput = Outputs["leads"]["addLeadTask"];
export type UpdateTaskInput = Inputs["leads"]["updateTask"];
export type BulkDeleteInput = Inputs["leads"]["bulkDelete"];
export type BulkConvertInput = Inputs["leads"]["bulkConvert"];
