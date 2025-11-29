import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  ConvertLeadInput,
  CreateLeadInput,
  ListLeadsInput,
  UpdateLeadInput,
} from "../inputs/leads";
import {
  BulkConvertLeadsInput,
  BulkDeleteLeadsInput,
  CreateLeadLogInput,
  CreateLeadNoteInput,
  CreateLeadTaskInput,
  UpdateLeadTaskInput,
} from "../inputs/lead-actions";
import { LeadOutput } from "../outputs/leads";
import {
  LeadLogOutput,
  LeadNoteOutput,
  LeadTaskOutput,
} from "../outputs/lead-actions";
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

  addNote: oc
    .route({
      method: "POST",
      path: "/leads/:leadId/notes",
      tags: ["Leads"],
      summary: "Add a note to a lead",
    })
    .input(
      z.object({
        params: z.object({ leadId: z.string() }),
        body: CreateLeadNoteInput.omit({ leadId: true }),
      })
    )
    .output(ApiResponse(LeadNoteOutput)),

  addLog: oc
    .route({
      method: "POST",
      path: "/leads/:leadId/logs",
      tags: ["Leads"],
      summary: "Add a log to a lead",
    })
    .input(
      z.object({
        params: z.object({ leadId: z.string() }),
        body: CreateLeadLogInput.omit({ leadId: true }),
      })
    )
    .output(ApiResponse(LeadLogOutput)),

  addTask: oc
    .route({
      method: "POST",
      path: "/leads/:leadId/tasks",
      tags: ["Leads"],
      summary: "Add a task to a lead",
    })
    .input(
      z.object({
        params: z.object({ leadId: z.string() }),
        body: CreateLeadTaskInput.omit({ leadId: true }),
      })
    )
    .output(ApiResponse(LeadTaskOutput)),

  updateTask: oc
    .route({
      method: "PUT",
      path: "/leads/tasks/:id",
      tags: ["Leads"],
      summary: "Update a lead task",
    })
    .input(
      z.object({
        params: z.object({ id: z.string() }),
        body: UpdateLeadTaskInput.omit({ id: true }),
      })
    )
    .output(ApiResponse(LeadTaskOutput)),

  bulkDelete: oc
    .route({
      method: "POST",
      path: "/leads/bulk-delete",
      tags: ["Leads"],
      summary: "Bulk delete leads",
    })
    .input(z.object({ body: BulkDeleteLeadsInput }))
    .output(SuccessResponse),

  bulkConvert: oc
    .route({
      method: "POST",
      path: "/leads/bulk-convert",
      tags: ["Leads"],
      summary: "Bulk convert leads to customers",
    })
    .input(z.object({ body: BulkConvertLeadsInput }))
    .output(SuccessResponse),
});
