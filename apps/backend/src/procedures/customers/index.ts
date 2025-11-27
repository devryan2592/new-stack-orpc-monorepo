import { privateProcedure } from "@/config/orpc";
import * as services from "./services";

const create = privateProcedure.customers.create.handler(async ({ input }) => {
  return services.createCustomer(input.body);
});

const list = privateProcedure.customers.list.handler(async ({ input }) => {
  return services.listCustomers(input.query);
});

const get = privateProcedure.customers.get.handler(async ({ input }) => {
  return services.getCustomer(input.params.id);
});

const update = privateProcedure.customers.update.handler(async ({ input }) => {
  return services.updateCustomer(input.params.id, input.body);
});

const deleteCustomer = privateProcedure.customers.delete.handler(
  async ({ input }) => {
    return services.deleteCustomer(input.params.id);
  }
);

export const customersRouter = {
  create,
  list,
  get,
  update,
  delete: deleteCustomer,
};
