import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  ConvertLeadInputSchema,
  CreateLeadInputSchema,
  ListLeadsInputSchema,
  UpdateLeadInputSchema,
} from "../inputs/leads";
import {
  BulkConvertLeadsInputSchema,
  BulkDeleteLeadsInputSchema,
  CreateLeadLogInputSchema,
  CreateLeadNoteInputSchema,
  CreateLeadTaskInputSchema,
  UpdateLeadTaskInputSchema,
} from "../inputs/lead-actions";
import { LeadOutput } from "../outputs/leads";
import {
  LeadLogOutput,
  LeadNoteOutput,
  LeadTaskOutput,
} from "../outputs/lead-actions";
import { CustomerOutput } from "../outputs/customers";
import { ApiResponse, SuccessResponse } from "../utils/api";

const createLeadContract = oc
  .route({
    method: "POST",
    path: "/leads",
    tags: ["Leads"],
    summary: "Create a new lead",
  })
  .input(z.object({ body: CreateLeadInputSchema }))
  .output(ApiResponse(LeadOutput));

const getAllLeadsContract = oc
  .route({
    method: "GET",
    path: "/leads",
    tags: ["Leads"],
    summary: "List all leads",
  })
  .input(z.object({ query: ListLeadsInputSchema }))
  .output(
    ApiResponse(
      z.object({
        leads: z.array(LeadOutput),
        total: z.number(),
      })
    )
  );

const getLeadByIdContract = oc
  .route({
    method: "GET",
    path: "/leads/:id",
    tags: ["Leads"],
    summary: "Get a lead by ID",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(ApiResponse(LeadOutput));

const updateLeadContract = oc
  .route({
    method: "PUT",
    path: "/leads/:id",
    tags: ["Leads"],
    summary: "Update a lead",
  })
  .input(
    z.object({
      params: z.object({ id: z.string() }),
      body: UpdateLeadInputSchema.omit({ id: true }),
    })
  )
  .output(ApiResponse(LeadOutput));

const deleteLeadContract = oc
  .route({
    method: "DELETE",
    path: "/leads/:id",
    tags: ["Leads"],
    summary: "Delete a lead",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(SuccessResponse);

const converLeadToCustomerContract = oc
  .route({
    method: "POST",
    path: "/leads/:id/convert",
    tags: ["Leads"],
    summary: "Convert a lead to a customer",
  })
  .input(
    z.object({
      params: z.object({ id: z.string() }),
      body: ConvertLeadInputSchema.omit({ leadId: true }).optional(),
    })
  )
  .output(ApiResponse(CustomerOutput));

const addLeadNoteContract = oc
  .route({
    method: "POST",
    path: "/leads/:leadId/notes",
    tags: ["Leads"],
    summary: "Add a note to a lead",
  })
  .input(
    z.object({
      params: z.object({ leadId: z.string() }),
      body: CreateLeadNoteInputSchema.omit({ leadId: true }),
    })
  )
  .output(ApiResponse(LeadNoteOutput));

const addLeadLogContract = oc
  .route({
    method: "POST",
    path: "/leads/:leadId/logs",
    tags: ["Leads"],
    summary: "Add a log to a lead",
  })
  .input(
    z.object({
      params: z.object({ leadId: z.string() }),
      body: CreateLeadLogInputSchema.omit({ leadId: true }),
    })
  )
  .output(ApiResponse(LeadLogOutput));

const addLeadTaskContract = oc
  .route({
    method: "POST",
    path: "/leads/:leadId/tasks",
    tags: ["Leads"],
    summary: "Add a task to a lead",
  })
  .input(
    z.object({
      params: z.object({ leadId: z.string() }),
      body: CreateLeadTaskInputSchema.omit({ leadId: true }),
    })
  )
  .output(ApiResponse(LeadTaskOutput));

const updateLeadTaskContract = oc
  .route({
    method: "PUT",
    path: "/leads/tasks/:id",
    tags: ["Leads"],
    summary: "Update a lead task",
  })
  .input(
    z.object({
      params: z.object({ id: z.string() }),
      body: UpdateLeadTaskInputSchema.omit({ id: true }),
    })
  )
  .output(ApiResponse(LeadTaskOutput));

const bulkDeleteLeadsContract = oc
  .route({
    method: "POST",
    path: "/leads/bulk-delete",
    tags: ["Leads"],
    summary: "Bulk delete leads",
  })
  .input(z.object({ body: BulkDeleteLeadsInputSchema }))
  .output(SuccessResponse);

const bulkConverLeadsContract = oc
  .route({
    method: "POST",
    path: "/leads/bulk-convert",
    tags: ["Leads"],
    summary: "Bulk convert leads to customers",
  })
  .input(z.object({ body: BulkConvertLeadsInputSchema }))
  .output(SuccessResponse);

export const leadsContract = oc.router({
  createLead: createLeadContract,
  getAllLeads: getAllLeadsContract,
  getLeadById: getLeadByIdContract,
  updateLead: updateLeadContract,
  deleteLead: deleteLeadContract,
  bulkDeleteLeads: bulkDeleteLeadsContract,
  convertLeadToCustomer: converLeadToCustomerContract,
  bulkConvertLeadToCustomer: bulkConverLeadsContract,

  addLeadNote: addLeadNoteContract,
  addLeadLog: addLeadLogContract,

  addLeadTask: addLeadTaskContract,
  updateLeadTask: updateLeadTaskContract,

  // Pending Contracts
  // UpdateLeadNote: updateLeadNoteContract,
  // UpdateLeadLog: updateLeadLogContract,

  // DeleteLeadNote: deleteLeadNoteContract,
  // DeleteLeadLog: deleteLeadLogContract,
  // DeleteLeadTask: deleteLeadTaskContract,
});
