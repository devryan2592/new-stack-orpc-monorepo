"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useLeadsClient, useLeadsQueryInvalidation } from "../utils";
import { ListLeadsInputType } from "@workspace/orpc-contract/inputs/leads";

export function useLeads(input: ListLeadsInputType = {}) {
  const client = useLeadsClient();
  return useQuery(client.list.queryOptions({ input: { query: input } }));
}

export function useLead(id: string) {
  const client = useLeadsClient();
  return useQuery(client.get.queryOptions({ input: { params: { id } } }));
}

export function useCreateLead() {
  const client = useLeadsClient();
  const { invalidateAll } = useLeadsQueryInvalidation();

  return useMutation(
    client.create.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useUpdateLead() {
  const client = useLeadsClient();
  const { invalidateAll } = useLeadsQueryInvalidation();

  return useMutation(
    client.update.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useDeleteLead() {
  const client = useLeadsClient();
  const { invalidateAll } = useLeadsQueryInvalidation();

  return useMutation(
    client.delete.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useConvertLead() {
  const client = useLeadsClient();
  const { invalidateAll } = useLeadsQueryInvalidation();

  return useMutation(
    client.convert.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}
