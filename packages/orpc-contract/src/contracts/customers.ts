import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  createCustomerSchema,
  listCustomersSchema,
  updateCustomerSchema,
} from "../inputs/customers";
import { CustomerOutputSchema } from "../outputs/customers";
import { ApiResponse, SuccessResponse } from "../utils/api";

const createCustomerContract = oc
  .route({
    method: "POST",
    path: "/customers",
    tags: ["Customers"],
    summary: "Create a new customer",
  })
  .input(z.object({ body: createCustomerSchema }))
  .output(ApiResponse(CustomerOutputSchema));

const getCustomerByIdContract = oc
  .route({
    method: "GET",
    path: "/customers/:id",
    tags: ["Customers"],
    summary: "Get a customer by ID",
  })
  .input(z.object({ params: z.object({ id: z.string() }) }))
  .output(ApiResponse(CustomerOutputSchema));

const getAllCustomersContract = oc
  .route({
    method: "GET",
    path: "/customers",
    tags: ["Customers"],
    summary: "Get all customers",
  })
  .input(z.object({ query: listCustomersSchema }))
  .output(
    ApiResponse(
      z.object({
        customers: z.array(CustomerOutputSchema),
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
      body: updateCustomerSchema,
    })
  )
  .output(ApiResponse(CustomerOutputSchema));

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
  createCustomer: createCustomerContract,
  listCustomers: getAllCustomersContract,
  getCustomerById: getCustomerByIdContract,
  updateCustomer: updateCustomerContract,
  deleteCustomer: deleteCustomerContract,
});
