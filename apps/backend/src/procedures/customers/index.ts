import { privateProcedure } from "@/config/orpc";
import { customerService } from "./services";

const create = privateProcedure.customers.create.handler(async ({ input }) => {
  return customerService.createCustomer(input.body);
});

const getAll = privateProcedure.customers.getAll.handler(async ({ input }) => {
  return customerService.getAllCustomers(input.query);
});

const getById = privateProcedure.customers.getById.handler(
  async ({ input }) => {
    return customerService.getCustomer(input.params.id);
  }
);

const update = privateProcedure.customers.update.handler(async ({ input }) => {
  return customerService.updateCustomer(input.params.id, input.body);
});

const deleteCustomer = privateProcedure.customers.delete.handler(
  async ({ input }) => {
    return customerService.deleteCustomer(input.params.id);
  }
);

export const customersRouter = {
  create,
  getAll,
  getById,
  update,
  delete: deleteCustomer,
};
