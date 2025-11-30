"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCustomersClient, useCustomersQueryInvalidation } from "../utils";
import {
  ListCustomersInput,
  ListCustomersInputType,
} from "@workspace/orpc-contract";

export function useCustomers(input: ListCustomersInputType = {}) {
  const client = useCustomersClient();
  return useQuery(client.getAll.queryOptions({ input: { query: input } }));
}

export function useCustomer(id: string) {
  const client = useCustomersClient();
  return useQuery(client.getById.queryOptions({ input: { params: { id } } }));
}

export function useCreateCustomer() {
  const client = useCustomersClient();
  const { invalidateAll, invalidateAllCustomers } =
    useCustomersQueryInvalidation();

  return useMutation(
    client.create.mutationOptions({
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
    client.update.mutationOptions({
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
    client.delete.mutationOptions({
      onSuccess: () => {
        invalidateAllCustomers();
      },
    })
  );
}
