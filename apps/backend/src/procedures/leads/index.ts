import { privateProcedure } from "@/config/orpc";
import { leadService } from "./services";

const create = privateProcedure.leads.create.handler(
  async ({ input }) => await leadService.createLead(input.body)
);

const list = privateProcedure.leads.list.handler(async ({ input }) =>
  leadService.listLeads(input.query)
);

const get = privateProcedure.leads.get.handler(async ({ input }) =>
  leadService.getLead(input.params.id)
);

const update = privateProcedure.leads.update.handler(async ({ input }) =>
  leadService.updateLead(input.params.id, input.body)
);

const deleteLead = privateProcedure.leads.delete.handler(async ({ input }) =>
  leadService.deleteLead(input.params.id)
);

const convert = privateProcedure.leads.convert.handler(async ({ input }) =>
  leadService.convertLead(input.params.id)
);

const addNote = privateProcedure.leads.addNote.handler(async ({ input }) =>
  leadService.addNote(input.params.leadId, input.body)
);

const addLog = privateProcedure.leads.addLog.handler(async ({ input }) =>
  leadService.addLog(input.params.leadId, input.body)
);

const addTask = privateProcedure.leads.addTask.handler(async ({ input }) =>
  leadService.addTask(input.params.leadId, input.body)
);

const updateTask = privateProcedure.leads.updateTask.handler(
  async ({ input }) => leadService.updateTask(input.params.id, input.body)
);

const bulkDelete = privateProcedure.leads.bulkDelete.handler(
  async ({ input }) => leadService.bulkDelete(input.body.ids)
);

const bulkConvert = privateProcedure.leads.bulkConvert.handler(
  async ({ input }) => leadService.bulkConvert(input.body.ids)
);

export const leadsRouter = {
  create,
  list,
  get,
  update,
  delete: deleteLead,
  convert,
  addNote,
  addTask,
  updateTask,
  bulkDelete,
  bulkConvert,
};
