"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useGalleryClient, useGalleryQueryInvalidation } from "../utils";
import { ListGalleryItemsInputType } from "@workspace/orpc-contract";

export function useGallery(input: ListGalleryItemsInputType = {}) {
  const client = useGalleryClient();
  return useQuery(client.list.queryOptions({ input: { query: input } }));
}

export function useCreateFolder() {
  const client = useGalleryClient();
  const { invalidateAll, invalidateAllGallery } = useGalleryQueryInvalidation();

  return useMutation(
    client.createFolder.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllGallery();
      },
    })
  );
}

export function useUpdateFolder() {
  const client = useGalleryClient();
  const { invalidateAll, invalidateAllGallery } = useGalleryQueryInvalidation();

  return useMutation(
    client.updateFolder.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllGallery();
      },
    })
  );
}

export function useDeleteFolder() {
  const client = useGalleryClient();
  const { invalidateAllGallery } = useGalleryQueryInvalidation();

  return useMutation(
    client.deleteFolder.mutationOptions({
      onSuccess: () => {
        invalidateAllGallery();
      },
    })
  );
}

export function useGenerateUploadSignature() {
  const client = useGalleryClient();
  return useMutation(client.generateUploadSignature.mutationOptions());
}

export function useCreateFile() {
  const client = useGalleryClient();
  const { invalidateAll, invalidateAllGallery } = useGalleryQueryInvalidation();

  return useMutation(
    client.createFile.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllGallery();
      },
    })
  );
}

export function useDeleteFile() {
  const client = useGalleryClient();
  const { invalidateAllGallery } = useGalleryQueryInvalidation();

  return useMutation(
    client.deleteFile.mutationOptions({
      onSuccess: () => {
        invalidateAllGallery();
      },
    })
  );
}
