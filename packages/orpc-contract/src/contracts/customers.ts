import { oc } from "@orpc/contract";
import { z } from "zod";
import {
  CreateCustomerInput,
  ListCustomersInput,
  UpdateCustomerInput,
} from "../inputs/customers";
import { CustomerOutput } from "../outputs/customers";
import { ApiResponse, SuccessResponse } from "../utils/api";

export const customersContract = oc.router({
  create: oc
    .route({
      method: "POST",
      path: "/customers",
      tags: ["Customers"],
      summary: "Create a new customer",
    })
    .input(z.object({ body: CreateCustomerInput }))
    .output(ApiResponse(CustomerOutput)),

  list: oc
    .route({
      method: "GET",
      path: "/customers",
      tags: ["Customers"],
      summary: "List all customers",
    })
    .input(z.object({ query: ListCustomersInput }))
    .output(
      ApiResponse(
        z.object({
          customers: z.array(CustomerOutput),
          total: z.number(),
        })
      )
    ),

  get: oc
    .route({
      method: "GET",
      path: "/customers/:id",
      tags: ["Customers"],
      summary: "Get a customer by ID",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(ApiResponse(CustomerOutput)),

  update: oc
    .route({
      method: "PUT",
      path: "/customers/:id",
      tags: ["Customers"],
      summary: "Update a customer",
    })
    .input(
      z.object({
        params: z.object({ id: z.string() }),
        body: UpdateCustomerInput.omit({ id: true }),
      })
    )
    .output(ApiResponse(CustomerOutput)),

  delete: oc
    .route({
      method: "DELETE",
      path: "/customers/:id",
      tags: ["Customers"],
      summary: "Delete a customer",
    })
    .input(z.object({ params: z.object({ id: z.string() }) }))
    .output(SuccessResponse),
});
