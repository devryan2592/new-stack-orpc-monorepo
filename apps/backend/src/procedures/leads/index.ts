import { privateProcedure } from "@/config/orpc";
import { leadService } from "./services";

const createLead = privateProcedure.leads.createLead.handler(
  async ({ input }) => await leadService.createLead(input.body)
);

const getAllLeads = privateProcedure.leads.getAllLeads.handler(
  async ({ input }) => leadService.listLeads(input.query)
);

const getLeadById = privateProcedure.leads.getLeadById.handler(
  async ({ input }) => leadService.getLeadById(input.params.id)
);

const updateLead = privateProcedure.leads.updateLead.handler(
  async ({ input }) => leadService.updateLead(input.params.id, input.body)
);

const deleteLead = privateProcedure.leads.deleteLead.handler(
  async ({ input }) => leadService.deleteLead(input.params.id)
);

const convertLeadToCustomer =
  privateProcedure.leads.convertLeadToCustomer.handler(async ({ input }) =>
    leadService.convertLeadToCustomer(input.params.id)
  );

const addLeadNote = privateProcedure.leads.addLeadNote.handler(
  async ({ input }) => leadService.addLeadNote(input.params.leadId, input.body)
);

const updateLeadNote = privateProcedure.leads.updateLeadNote.handler(
  async ({ input }) => leadService.updateLeadNote(input.params.id, input.body)
);

const addLeadLog = privateProcedure.leads.addLeadLog.handler(
  async ({ input }) => leadService.addLeadLog(input.params.leadId, input.body)
);

const updateLeadLog = privateProcedure.leads.updateLeadLog.handler(
  async ({ input }) => leadService.updateLeadLog(input.params.id, input.body)
);

const addLeadTask = privateProcedure.leads.addLeadTask.handler(
  async ({ input }) => leadService.addLeadTask(input.params.leadId, input.body)
);

const updateLeadTask = privateProcedure.leads.updateLeadTask.handler(
  async ({ input }) => leadService.updateLeadTask(input.params.id, input.body)
);

const bulkDeleteLeads = privateProcedure.leads.bulkDeleteLeads.handler(
  async ({ input }) => leadService.bulkDeleteLeads(input.body)
);

const bulkConvertLeadToCustomer =
  privateProcedure.leads.bulkConvertLeadToCustomer.handler(async ({ input }) =>
    leadService.bulkConvertLeads(input.body)
  );

export const leadsRouter = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  convertLeadToCustomer,
  addLeadNote,
  updateLeadNote,
  addLeadLog,
  updateLeadLog,
  addLeadTask,
  updateLeadTask,
  bulkDeleteLeads,
  bulkConvertLeadToCustomer,
};
