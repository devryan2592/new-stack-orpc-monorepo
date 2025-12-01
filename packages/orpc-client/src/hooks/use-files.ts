"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useFilesClient, useFilesQueryInvalidation } from "../utils";
import { ListFilesInputType } from "@workspace/orpc-contract";

export function useFiles(input: ListFilesInputType = {}) {
  const client = useFilesClient();
  return useQuery(client.listFiles.queryOptions({ input: { query: input } }));
}

export function useFile(id: string) {
  const client = useFilesClient();
  return useQuery(
    client.getFileById.queryOptions({ input: { params: { id } } })
  );
}

export function useDeleteFile() {
  const client = useFilesClient();
  const { invalidateAllFiles } = useFilesQueryInvalidation();

  return useMutation(
    client.deleteFile.mutationOptions({
      onSuccess: () => {
        invalidateAllFiles();
      },
    })
  );
}
