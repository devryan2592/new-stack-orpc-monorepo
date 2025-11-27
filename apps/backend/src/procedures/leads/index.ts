import { privateProcedure } from "@/config/orpc";
import * as services from "./services";

const create = privateProcedure.leads.create.handler(async ({ input }) => {
  return services.createLead(input.body);
});

const list = privateProcedure.leads.list.handler(async ({ input }) => {
  return services.listLeads(input.query);
});

const get = privateProcedure.leads.get.handler(async ({ input }) => {
  return services.getLead(input.params.id);
});

const update = privateProcedure.leads.update.handler(async ({ input }) => {
  return services.updateLead(input.params.id, input.body);
});

const deleteLead = privateProcedure.leads.delete.handler(async ({ input }) => {
  return services.deleteLead(input.params.id);
});

const convert = privateProcedure.leads.convert.handler(async ({ input }) => {
  return services.convertLead(input.params.id);
});

export const leadsRouter = {
  create,
  list,
  get,
  update,
  delete: deleteLead,
  convert,
};
