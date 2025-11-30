"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useLeadsClient, useLeadsQueryInvalidation } from "../utils";
import { ListLeadsInputType } from "@workspace/orpc-contract";

export function useLeads(input: ListLeadsInputType = {}) {
  const client = useLeadsClient();
  return useQuery(
    client.list.queryOptions({
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
    ...client.get.queryOptions({ input }),
    enabled: options?.enabled && !!input.params.id,
    refetchOnWindowFocus: false,
  });
}

export function useCreateLead() {
  const client = useLeadsClient();
  const { invalidateAllLeads, invalidateAll } = useLeadsQueryInvalidation();

  return useMutation(
    client.create.mutationOptions({
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
    client.update.mutationOptions({
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
    client.delete.mutationOptions({
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
    client.convert.mutationOptions({
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
    client.addNote.mutationOptions({
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
    client.addLog.mutationOptions({
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
    client.addTask.mutationOptions({
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
    client.updateTask.mutationOptions({
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
    client.bulkDelete.mutationOptions({
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
    client.bulkConvert.mutationOptions({
      onSuccess: () => {
        invalidateAll();
      },
    })
  );
}
