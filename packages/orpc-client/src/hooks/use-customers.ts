"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCustomersClient, useCustomersQueryInvalidation } from "../utils";
import {
  ListCustomersInput,
  ListCustomersInputType,
} from "@workspace/orpc-contract/inputs/customers";

export function useCustomers(input: ListCustomersInputType = {}) {
  const client = useCustomersClient();
  return useQuery(client.list.queryOptions({ input: { query: input } }));
}

export function useCustomer(id: string) {
  const client = useCustomersClient();
  return useQuery(client.get.queryOptions({ input: { params: { id } } }));
}

export function useCreateCustomer() {
  const client = useCustomersClient();
  const { invalidateAll } = useCustomersQueryInvalidation();

  return useMutation(
    client.create.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useUpdateCustomer() {
  const client = useCustomersClient();
  const { invalidateAll } = useCustomersQueryInvalidation();

  return useMutation(
    client.update.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useDeleteCustomer() {
  const client = useCustomersClient();
  const { invalidateAll } = useCustomersQueryInvalidation();

  return useMutation(
    client.delete.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}
