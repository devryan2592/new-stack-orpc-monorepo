import { privateProcedure } from "@/config/orpc";
import { customerService } from "./services";

const createCustomer = privateProcedure.customers.createCustomer.handler(async ({ input }) => {
  return customerService.createCustomer(input.body);
});

const listCustomers = privateProcedure.customers.listCustomers.handler(async ({ input }) => {
  return customerService.getAllCustomers(input.query);
});

const getCustomerById = privateProcedure.customers.getCustomerById.handler(
  async ({ input }) => {
    return customerService.getCustomer(input.params.id);
  }
);

const updateCustomer = privateProcedure.customers.updateCustomer.handler(async ({ input }) => {
  return customerService.updateCustomer(input.params.id, input.body);
});

const deleteCustomer = privateProcedure.customers.deleteCustomer.handler(
  async ({ input }) => {
    return customerService.deleteCustomer(input.params.id);
  }
);

export const customersRouter = {
  createCustomer,
  listCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
