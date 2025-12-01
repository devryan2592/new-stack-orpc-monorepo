import { privateProcedure } from "@/config/orpc";
import { leadService } from "./services";

const createLead = privateProcedure.leads.createLead.handler(async ({ input }) => {
  return leadService.createLead(input.body);
});

const listLeads = privateProcedure.leads.listLeads.handler(async ({ input }) => {
  return leadService.listLeads(input.query);
});

const getLeadById = privateProcedure.leads.getLeadById.handler(async ({ input }) => {
  return leadService.getLeadById(input.params.id);
});

const updateLead = privateProcedure.leads.updateLead.handler(async ({ input }) => {
  return leadService.updateLead(input.params.id, input.body);
});

const deleteLead = privateProcedure.leads.deleteLead.handler(async ({ input }) => {
  return leadService.deleteLead(input.params.id);
});

const bulkDeleteLeads = privateProcedure.leads.bulkDeleteLeads.handler(async ({ input }) => {
  return leadService.bulkDeleteLeads(input.body);
});

const convertLeadToCustomer = privateProcedure.leads.convertLeadToCustomer.handler(async ({ input }) => {
  return leadService.convertLeadToCustomer(input.params.id, input.body);
});

const bulkConvertLeadToCustomer = privateProcedure.leads.bulkConvertLeadToCustomer.handler(async ({ input }) => {
  return leadService.bulkConvertLeads(input.body);
});

const addLeadNote = privateProcedure.leads.addLeadNote.handler(async ({ input, context }) => {
  return leadService.addLeadNote(context.user.id, input.params.leadId, input.body);
});

const updateLeadNote = privateProcedure.leads.updateLeadNote.handler(async ({ input }) => {
  return leadService.updateLeadNote(input.params.id, input.body);
});

const addLeadLog = privateProcedure.leads.addLeadLog.handler(async ({ input, context }) => {
  return leadService.addLeadLog(context.user.id, input.params.leadId, input.body);
});

const updateLeadLog = privateProcedure.leads.updateLeadLog.handler(async ({ input }) => {
  return leadService.updateLeadLog(input.params.id, input.body);
});

const addLeadTask = privateProcedure.leads.addLeadTask.handler(async ({ input }) => {
  return leadService.addLeadTask(input.params.leadId, input.body);
});

const updateLeadTask = privateProcedure.leads.updateLeadTask.handler(async ({ input }) => {
  return leadService.updateLeadTask(input.params.id, input.body);
});

export const leadsRouter = {
  createLead,
  listLeads,
  getLeadById,
  updateLead,
  deleteLead,
  bulkDeleteLeads,
  convertLeadToCustomer,
  bulkConvertLeadToCustomer,
  addLeadNote,
  updateLeadNote,
  addLeadLog,
  updateLeadLog,
  addLeadTask,
  updateLeadTask,
};
