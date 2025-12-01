"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useLeadsClient, useLeadsQueryInvalidation } from "../utils";
import { ListLeadsInput } from "@workspace/orpc-contract";

export function useLeads(input: ListLeadsInput = {}) {
  const client = useLeadsClient();
  return useQuery(
    client.getAllLeads.queryOptions({
      input: { query: input },
      refetchOnWindowFocus: false,
    })
  );
}

export function useLead(
  input: { params: { id: string } },
  options?: { enabled?: boolean }
) {
  const client = useLeadsClient();
  return useQuery({
    ...client.getLeadById.queryOptions({ input }),
    enabled: options?.enabled && !!input.params.id,
    refetchOnWindowFocus: false,
  });
}

export function useCreateLead() {
  const client = useLeadsClient();
  const { invalidateAllLeads, invalidateAll } = useLeadsQueryInvalidation();

  return useMutation(
    client.createLead.mutationOptions({
      onSuccess: (data) => {
        console.log("Created Lead: From ORPC Client: ", data);
        invalidateAll();
        invalidateAllLeads();
      },
    })
  );
}

export function useUpdateLead() {
  const client = useLeadsClient();
  const { invalidateAllLeads, invalidateAll, invalidateById } =
    useLeadsQueryInvalidation();

  return useMutation(
    client.updateLead.mutationOptions({
      onSuccess: (data, variables) => {
        console.log("Updated Lead: From ORPC Client: ", data);
        invalidateAll();
        invalidateAllLeads();
        invalidateById(variables.params.id);
      },
    })
  );
}

export function useDeleteLead() {
  const client = useLeadsClient();
  const { invalidateAllLeads } = useLeadsQueryInvalidation();

  return useMutation(
    client.deleteLead.mutationOptions({
      onSuccess: () => {
        return invalidateAllLeads();
      },
    })
  );
}

export function useConvertLead() {
  const client = useLeadsClient();
  const { invalidateAllLeads } = useLeadsQueryInvalidation();

  return useMutation(
    client.convertLeadToCustomer.mutationOptions({
      onSuccess: () => {
        return invalidateAllLeads();
      },
    })
  );
}

export function useAddNote() {
  const client = useLeadsClient();
  const { invalidateAllLeads } = useLeadsQueryInvalidation();

  return useMutation(
    client.addLeadNote.mutationOptions({
      onSuccess: () => {
        return invalidateAllLeads();
      },
    })
  );
}

export function useAddLog() {
  const client = useLeadsClient();
  const { invalidateAllLeads } = useLeadsQueryInvalidation();

  return useMutation(
    client.addLeadLog.mutationOptions({
      onSuccess: () => {
        return invalidateAllLeads();
      },
    })
  );
}

export function useAddTask() {
  const client = useLeadsClient();
  const { invalidateAllLeads } = useLeadsQueryInvalidation();

  return useMutation(
    client.addLeadTask.mutationOptions({
      onSuccess: () => {
        return invalidateAllLeads();
      },
    })
  );
}

export function useUpdateTask() {
  const client = useLeadsClient();
  const { invalidateAll } = useLeadsQueryInvalidation();

  return useMutation(
    client.updateLeadTask.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useBulkDeleteLeads() {
  const client = useLeadsClient();
  const { invalidateAll } = useLeadsQueryInvalidation();

  return useMutation(
    client.bulkDeleteLeads.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}

export function useBulkConvertLeads() {
  const client = useLeadsClient();
  const { invalidateAll } = useLeadsQueryInvalidation();

  return useMutation(
    client.bulkConvertLeadToCustomer.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}
