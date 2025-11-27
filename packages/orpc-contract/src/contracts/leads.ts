import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  ConvertLeadInput,
  CreateLeadInput,
  ListLeadsInput,
  UpdateLeadInput,
} from "../inputs/leads";
import { LeadOutput } from "../outputs/leads";
import { CustomerOutput } from "../outputs/customers";
import { ApiResponse, SuccessResponse } from "../utils/api";

export const leadsContract = oc.router({
  create: oc
    .route({
      method: "POST",
      path: "/leads",
      tags: ["Leads"],
      summary: "Create a new lead",
    })
    .input(z.object({ body: CreateLeadInput }))
    .output(ApiResponse(LeadOutput)),

  list: oc
    .route({
      method: "GET",
      path: "/leads",
      tags: ["Leads"],
      summary: "List all leads",
    })
    .input(z.object({ query: ListLeadsInput }))
    .output(
      ApiResponse(
        z.object({
          leads: z.array(LeadOutput),
          total: z.number(),
        })
      )
    ),

  get: oc
    .route({
      method: "GET",
      path: "/leads/:id",
      tags: ["Leads"],
      summary: "Get a lead by ID",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(ApiResponse(LeadOutput)),

  update: oc
    .route({
      method: "PUT",
      path: "/leads/:id",
      tags: ["Leads"],
      summary: "Update a lead",
    })
    .input(
      z.object({
        params: z.object({ id: z.string() }),
        body: UpdateLeadInput.omit({ id: true }),
      })
    )
    .output(ApiResponse(LeadOutput)),

  delete: oc
    .route({
      method: "DELETE",
      path: "/leads/:id",
      tags: ["Leads"],
      summary: "Delete a lead",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(SuccessResponse),

  convert: oc
    .route({
      method: "POST",
      path: "/leads/:id/convert",
      tags: ["Leads"],
      summary: "Convert a lead to a customer",
    })
    .input(
      z.object({
        params: z.object({ id: z.string() }),
        body: ConvertLeadInput.omit({ leadId: true }).optional(),
      })
    )
    .output(ApiResponse(CustomerOutput)),
});
