import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  convertLeadSchema,
  createLeadSchema,
  listLeadsSchema,
  updateLeadSchema,
} from "../inputs/leads";
import {
  bulkConvertLeadsSchema,
  bulkDeleteLeadsSchema,
  createLeadLogSchema,
  createLeadNoteSchema,
  createLeadTaskSchema,
  updateLeadLogSchema,
  updateLeadNoteSchema,
  updateLeadTaskSchema,
} from "../inputs/lead-actions";
import { LeadOutputSchema } from "../outputs/leads";
import {
  LeadLogOutputSchema,
  LeadNoteOutputSchema,
  LeadTaskOutputSchema,
} from "../outputs/lead-actions";
import { CustomerOutputSchema } from "../outputs/customers";
import { ApiResponse, SuccessResponse } from "../utils/api";

const createLeadContract = oc
  .route({
    method: "POST",
    path: "/leads",
    tags: ["Leads"],
    summary: "Create a new lead",
  })
  .input(z.object({ body: createLeadSchema }))
  .output(ApiResponse(LeadOutputSchema));

const getAllLeadsContract = oc
  .route({
    method: "GET",
    path: "/leads",
    tags: ["Leads"],
    summary: "List all leads",
  })
  .input(z.object({ query: listLeadsSchema }))
  .output(
    ApiResponse(
      z.object({
        leads: z.array(LeadOutputSchema),
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
  .output(ApiResponse(LeadOutputSchema));

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
      body: updateLeadSchema,
    })
  )
  .output(ApiResponse(LeadOutputSchema));

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
      body: convertLeadSchema.omit({ leadId: true }).optional(),
    })
  )
  .output(ApiResponse(CustomerOutputSchema));

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
      body: createLeadNoteSchema.omit({ leadId: true }),
    })
  )
  .output(ApiResponse(LeadNoteOutputSchema));

const updateLeadNoteContract = oc
  .route({
    method: "PUT",
    path: "/leads/notes/:id",
    tags: ["Leads"],
    summary: "Update a lead note",
  })
  .input(
    z.object({
      params: z.object({ id: z.string() }),
      body: updateLeadNoteSchema,
    })
  )
  .output(ApiResponse(LeadNoteOutputSchema));

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
      body: createLeadLogSchema.omit({ leadId: true }),
    })
  )
  .output(ApiResponse(LeadLogOutputSchema));

const updateLeadLogContract = oc
  .route({
    method: "PUT",
    path: "/leads/logs/:id",
    tags: ["Leads"],
    summary: "Update a lead log",
  })
  .input(
    z.object({
      params: z.object({ id: z.string() }),
      body: updateLeadLogSchema,
    })
  )
  .output(ApiResponse(LeadLogOutputSchema));

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
      body: createLeadTaskSchema.omit({ leadId: true }),
    })
  )
  .output(ApiResponse(LeadTaskOutputSchema));

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
      body: updateLeadTaskSchema,
    })
  )
  .output(ApiResponse(LeadTaskOutputSchema));

const bulkDeleteLeadsContract = oc
  .route({
    method: "POST",
    path: "/leads/bulk-delete",
    tags: ["Leads"],
    summary: "Bulk delete leads",
  })
  .input(z.object({ body: bulkDeleteLeadsSchema }))
  .output(SuccessResponse);

const bulkConverLeadsContract = oc
  .route({
    method: "POST",
    path: "/leads/bulk-convert",
    tags: ["Leads"],
    summary: "Bulk convert leads to customers",
  })
  .input(z.object({ body: bulkConvertLeadsSchema }))
  .output(SuccessResponse);

export const leadsContract = oc.router({
  createLead: createLeadContract,
  listLeads: getAllLeadsContract,
  getLeadById: getLeadByIdContract,
  updateLead: updateLeadContract,
  deleteLead: deleteLeadContract,
  bulkDeleteLeads: bulkDeleteLeadsContract,
  convertLeadToCustomer: converLeadToCustomerContract,
  bulkConvertLeadToCustomer: bulkConverLeadsContract,

  addLeadNote: addLeadNoteContract,
  updateLeadNote: updateLeadNoteContract,

  addLeadLog: addLeadLogContract,
  updateLeadLog: updateLeadLogContract,

  addLeadTask: addLeadTaskContract,
  updateLeadTask: updateLeadTaskContract,
});
