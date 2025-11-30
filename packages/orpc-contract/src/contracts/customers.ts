import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  CreateCustomerInputSchema,
  ListCustomersInputSchema,
  UpdateCustomerInputSchema,
} from "../inputs/customers";
import { CustomerOutput } from "../outputs/customers";
import { ApiResponse, SuccessResponse } from "../utils/api";

const createCustomerContract = oc
  .route({
    method: "POST",
    path: "/customers",
    tags: ["Customers"],
    summary: "Create a new customer",
  })
  .input(z.object({ body: CreateCustomerInputSchema }))
  .output(ApiResponse(CustomerOutput));

const getCustomerByIdContract = oc
  .route({
    method: "GET",
    path: "/customers/:id",
    tags: ["Customers"],
    summary: "Get a customer by ID",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(ApiResponse(CustomerOutput));

const getAllCustomersContract = oc
  .route({
    method: "GET",
    path: "/customers",
    tags: ["Customers"],
    summary: "Get all customers",
  })
  .input(z.object({ query: ListCustomersInputSchema }))
  .output(
    ApiResponse(
      z.object({
        customers: z.array(CustomerOutput),
        total: z.number(),
      })
    )
  );

const updateCustomerContract = oc
  .route({
    method: "PUT",
    path: "/customers/:id",
    tags: ["Customers"],
    summary: "Update a customer",
  })
  .input(
    z.object({
      params: z.object({ id: z.string() }),
      body: UpdateCustomerInputSchema.omit({ id: true }),
    })
  )
  .output(ApiResponse(CustomerOutput));

const deleteCustomerContract = oc
  .route({
    method: "DELETE",
    path: "/customers/:id",
    tags: ["Customers"],
    summary: "Delete a customer",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(SuccessResponse);

export const customersContract = oc.router({
  create: createCustomerContract,
  getAll: getAllCustomersContract,
  getById: getCustomerByIdContract,
  update: updateCustomerContract,
  delete: deleteCustomerContract,
});
