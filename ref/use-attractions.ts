"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  useAttractionClient,
  useAttractionQueryInvalidation,
} from "@workspace/orpc-client/utils";
import { GetAttractionsInputType } from "@workspace/orpc-contracts/inputs";
import Decimal from "decimal.js";
import { toast } from "sonner";

// ============================================================================
// ATTRACTION HOOKS
// ============================================================================

/**
 * Hook to fetch all attractions with optional filters
 * @param filters - Optional filters for attractions
 * @returns Query result with attractions data, loading state, and error
 */
export function useAttractions(filters?: Partial<GetAttractionsInputType>) {
  const attraction = useAttractionClient();

  const query: GetAttractionsInputType = {
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...filters,
  };

  return useQuery(
    attraction.getAll.queryOptions({
      input: {
        query,
      },
      refetchOnWindowFocus: false,
    })
  );
}

/**
 * Hook to fetch a single attraction by ID
 * @param id - Attraction ID
 * @param enabled - Whether the query should be enabled
 * @returns Query result with attraction data, loading state, and error
 */
export function useAttraction(id: string, enabled: boolean = true) {
  const attraction = useAttractionClient();

  return useQuery(
    attraction.getById.queryOptions({
      input: { params: { id } },
      enabled: enabled && !!id,
      refetchOnWindowFocus: false,
    })
  );
}

/**
 * Hook to fetch a single attraction by slug
 * @param slug - Attraction slug
 * @param enabled - Whether the query should be enabled
 * @returns Query result with attraction data, loading state, and error
 */
export function useAttractionBySlug(slug: string, enabled: boolean = true) {
  const attraction = useAttractionClient();

  return useQuery(
    attraction.getBySlug.queryOptions({
      input: { params: { slug } },
      enabled: enabled && !!slug,
      refetchOnWindowFocus: false,
    })
  );
}

/**
 * Hook to create a new attraction
 * @returns Mutation object for creating attractions
 */
export function useCreateAttraction() {
  const attraction = useAttractionClient();
  const { invalidateAll, invalidateAllAttractions } =
    useAttractionQueryInvalidation();

  return useMutation(
    attraction.create.mutationOptions({
      onSuccess: (data) => {
        console.log("create attraction success", data);
        invalidateAll();
        invalidateAllAttractions();
      },
      onError: (error: any) => {
        console.error("Error creating attraction:", error);
      },
    })
  );
}

/**
 * Hook to update an existing attraction
 * @returns Mutation object for updating attractions
 */
export function useUpdateAttraction() {
  const attraction = useAttractionClient();
  const { invalidateAll, invalidateById, invalidateAllAttractions } =
    useAttractionQueryInvalidation();

  return useMutation(
    attraction.update.mutationOptions({
      onSuccess: (data, variables) => {
        console.log("update attraction success", data);
        invalidateAll();
        invalidateById(variables.params.id);
        invalidateAllAttractions();
      },
      onError: (error: any) => {
        console.error("Error updating attraction:", error);
      },
    })
  );
}

/**
 * Hook to delete an attraction
 * @returns Mutation object for deleting attractions
 */
export function useDeleteAttraction() {
  const attraction = useAttractionClient();
  const { invalidateAll, invalidateAllAttractions } =
    useAttractionQueryInvalidation();

  return useMutation(
    attraction.delete.mutationOptions({
      onSuccess: (data) => {
        console.log("delete attraction success", data);
        invalidateAll();
        invalidateAllAttractions();
        toast.success("Attraction deleted successfully");
      },
      onError: (error: any) => {
        console.error("Error deleting attraction:", error);
        toast.error(
          error?.message || "Failed to delete attraction. Please try again."
        );
      },
    })
  );
}

/**
 * Hook to search attractions
 * @param searchQuery - Search query string
 * @param filters - Additional filters
 * @returns Query result with filtered attractions
 */
export function useSearchAttractions(
  searchQuery: string,
  filters?: Partial<GetAttractionsInputType>
) {
  const attraction = useAttractionClient();

  const query: GetAttractionsInputType = {
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: searchQuery,
    ...filters,
  };

  return useQuery(
    attraction.getAll.queryOptions({
      input: {
        query,
      },
      enabled: !!searchQuery.trim(),
      refetchOnWindowFocus: false,
    })
  );
}

/**
 * Hook to fetch attraction metrics
 * @returns Query result with attraction metrics
 */
export function useAttractionMetrics() {
  const attraction = useAttractionClient();

  return useQuery(
    attraction.getMetrics.queryOptions({
      enabled: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 1000 * 60, // 1 minute
    })
  );
}

// ------------------------------------------------------------
// Helper: Compute total amount for a selection
// ------------------------------------------------------------
export function computeAttractionTotal(params: {
  optionId: string;
  transferType: "WITHOUT" | "SHARED" | "PRIVATE";
  qtyAdult: number;
  qtyChild: number;
  qtyInfant: number;
  attraction: {
    options: Array<{
      id: string;
      transfers: Array<{
        type: string;
        rates: Array<{ ageBand: string; price: Decimal | string | number }>;
      }>;
    }>;
  };
}) {
  const opt = params.attraction.options.find((o) => o.id === params.optionId);
  if (!opt) return new Decimal(0);
  const tr = opt.transfers.find((t) => t.type === params.transferType);
  if (!tr) return new Decimal(0);

  const getPrice = (band: "ADULT" | "CHILD" | "INFANT") => {
    const rate = tr.rates.find((r) => r.ageBand === band);
    return rate ? new Decimal(rate.price as any) : new Decimal(0);
  };

  const adult = getPrice("ADULT").mul(params.qtyAdult);
  const child = getPrice("CHILD").mul(params.qtyChild);
  const infant = getPrice("INFANT").mul(params.qtyInfant);
  return adult.plus(child).plus(infant);
}
