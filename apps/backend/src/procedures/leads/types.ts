import { Inputs, Outputs } from "@/config/orpc";

export type CreateLeadInput = Inputs["leads"]["create"];

export type ListLeadsInput = Inputs["leads"]["list"];
export type UpdateLeadInput = Inputs["leads"]["update"];
export type DeleteLeadInput = Inputs["leads"]["delete"];
export type ConvertLeadInput = Inputs["leads"]["convert"];

export type AddNoteInput = Inputs["leads"]["addNote"];
export type AddLogInput = Inputs["leads"]["addLog"];
export type AddTaskInput = Inputs["leads"]["addTask"];
export type UpdateTaskInput = Inputs["leads"]["updateTask"];
export type BulkDeleteInput = Inputs["leads"]["bulkDelete"];
export type BulkConvertInput = Inputs["leads"]["bulkConvert"];

export type LeadOutput = Outputs["leads"]["create"];
export type ListLeadsOutput = Outputs["leads"]["list"];
