"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useGalleryClient, useGalleryQueryInvalidation } from "../utils";
import { ListGalleryItemsInputType } from "@workspace/orpc-contract";

export function useGallery(input: ListGalleryItemsInputType = {}) {
  const client = useGalleryClient();
  return useQuery(
    client.listGalleryItems.queryOptions({ input: { query: input } })
  );
}

export function useCreateFolder() {
  const client = useGalleryClient();
  const { invalidateAll, invalidateAllGallery } = useGalleryQueryInvalidation();

  return useMutation(
    client.createGalleryFolder.mutationOptions({
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
    client.updateGalleryFolder.mutationOptions({
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
    client.deleteGalleryFolder.mutationOptions({
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
    client.createGalleryFile.mutationOptions({
      onSuccess: () => {
        invalidateAll();
        invalidateAllGallery();
      },
    })
  );
}

export function useDeleteGalleryFile() {
  const client = useGalleryClient();
  const { invalidateAllGallery } = useGalleryQueryInvalidation();

  return useMutation(
    client.deleteGalleryFile.mutationOptions({
      onSuccess: () => {
        invalidateAllGallery();
      },
    })
  );
}
