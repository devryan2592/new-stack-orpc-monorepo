"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCustomersClient, useCustomersQueryInvalidation } from "../utils";
import {
  ListCustomersInputType,
  CreateCustomerInputType,
  UpdateCustomerInputType,
} from "@workspace/orpc-contract";

export function useCustomers(input: ListCustomersInputType = {}) {
  const client = useCustomersClient();
  return useQuery(
    client.listCustomers.queryOptions({ input: { query: input } })
  );
}

export function useCustomer(id: string) {
  const client = useCustomersClient();
  return useQuery(
    client.getCustomerById.queryOptions({ input: { params: { id } } })
  );
}

export function useCreateCustomer() {
  const client = useCustomersClient();
  const { invalidateAll, invalidateAllCustomers } =
    useCustomersQueryInvalidation();

  return useMutation(
    client.createCustomer.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllCustomers();
      },
    })
  );
}

export function useUpdateCustomer() {
  const client = useCustomersClient();
  const { invalidateAll, invalidateAllCustomers, invalidateById } =
    useCustomersQueryInvalidation();

  return useMutation(
    client.updateCustomer.mutationOptions({
      onSuccess: (data, variables) => {
        invalidateAll();
        invalidateAllCustomers();
        invalidateById(variables.params.id);
      },
    })
  );
}

export function useDeleteCustomer() {
  const client = useCustomersClient();
  const { invalidateAllCustomers } = useCustomersQueryInvalidation();

  return useMutation(
    client.deleteCustomer.mutationOptions({
      onSuccess: () => {
        invalidateAllCustomers();
      },
    })
  );
}
