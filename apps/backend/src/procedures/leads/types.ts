import { Inputs, Outputs } from "@/config/orpc";

export type CreateLeadInput = Inputs["leads"]["create"];
export type ListLeadsInput = Inputs["leads"]["list"];
export type UpdateLeadInput = Inputs["leads"]["update"];
export type DeleteLeadInput = Inputs["leads"]["delete"];
export type ConvertLeadInput = Inputs["leads"]["convert"];

export type LeadOutput = Outputs["leads"]["create"];
export type ListLeadsOutput = Outputs["leads"]["list"];
