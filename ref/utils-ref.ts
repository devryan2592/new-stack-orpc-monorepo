// packages/orpc-client/src/utils.tsx
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/server-caller";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

/** Hook to get oRPC utilities with TanStack Query integration */
export function useORPC() {
  return createTanstackQueryUtils(client);
}

// Gallery Client and Invalidation
export function useGalleryClient() {
  return createTanstackQueryUtils(client.gallery, {
    path: ["gallery"],
  });
}

export function useGalleryQueryInvalidation() {
  const galleryORPC = useGalleryClient();
  const queryClient = useQueryClient();

  return {
    invalidateFolders: () =>
      queryClient.invalidateQueries({
        queryKey: galleryORPC.folder.getAll.key(),
      }),
    invalidateFolder: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: galleryORPC.folder.getById.key({ input: { params: { id } } }),
      }),
    invalidateFiles: (folderId?: string) =>
      queryClient.invalidateQueries({
        queryKey: galleryORPC.file.getByFolderId.key({
          input: { params: { id: folderId } },
        }),
      }),
    invalidateFile: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: galleryORPC.file.getByFileId.key({
          input: { params: { id } },
        }),
      }),
  };
}

// Destination Client and Invalidation
export function useDestinationClient() {
  return createTanstackQueryUtils(client.destination, {
    path: ["destination"],
  });
}

export function useDestinationQueryInvalidation() {
  const destinationORPC = useDestinationClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: destinationORPC.getAll.key(),
      }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: destinationORPC.getById.key({ input: { params: { id } } }),
      }),
    invalidateBySlug: (slug: string) =>
      queryClient.invalidateQueries({
        queryKey: destinationORPC.getBySlug.key({
          input: { params: { slug } },
        }),
      }),
    invalidateAllDestinations: () =>
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "destination";
        },
      }),
  };
}

// Attraction Client and Invalidation
export function useAttractionClient() {
  return createTanstackQueryUtils(client.attraction, {
    path: ["attraction"],
  });
}

export function useAttractionQueryInvalidation() {
  const attractionORPC = useAttractionClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: attractionORPC.getAll.key(),
      }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: attractionORPC.getById.key({ input: { params: { id } } }),
      }),
    invalidateBySlug: (slug: string) =>
      queryClient.invalidateQueries({
        queryKey: attractionORPC.getBySlug.key({ input: { params: { slug } } }),
      }),
    invalidateAllAttractions: () =>
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "attraction";
        },
      }),
  };
}

// Tour Client and Invalidation
export function useTourClient() {
  return createTanstackQueryUtils(client.tour, {
    path: ["tour"],
  });
}

export function useTourQueryInvalidation() {
  const tourORPC = useTourClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: tourORPC.getAll.key(),
      }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: tourORPC.getById.key({ input: { params: { id } } }),
      }),
    invalidateBySlug: (slug: string) =>
      queryClient.invalidateQueries({
        queryKey: tourORPC.getBySlug.key({ input: { params: { slug } } }),
      }),
    invalidateAllTours: () =>
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "tour";
        },
      }),
  };
}

export function useItineraryClient() {
  return createTanstackQueryUtils(client.itinerary, {
    path: ["itinerary"],
  });
}

export function useItineraryQueryInvalidation() {
  const itineraryORPC = useItineraryClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: itineraryORPC.getAll.key(),
      }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: itineraryORPC.getById.key({ input: { params: { id } } }),
      }),
    invalidateAllItineraries: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "itinerary",
      }),
  };
}

export function useLibraryClient() {
  return createTanstackQueryUtils(client.library, {
    path: ["library"],
  });
}

export function useLibraryQueryInvalidation() {
  const libraryORPC = useLibraryClient();
  const queryClient = useQueryClient();

  return {
    invalidateAttractions: () =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.attractions.getAll.key() }),
    invalidateAttractionById: (id: string) =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.attractions.getById.key({ input: { params: { id } } }) }),
    invalidateHotels: () =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.hotels.getAll.key() }),
    invalidateHotelById: (id: string) =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.hotels.getById.key({ input: { params: { id } } }) }),
    invalidateFlights: () =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.flights.getAll.key() }),
    invalidateFlightById: (id: string) =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.flights.getById.key({ input: { params: { id } } }) }),
    invalidateTransports: () =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.transports.getAll.key() }),
    invalidateTransportById: (id: string) =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.transports.getById.key({ input: { params: { id } } }) }),
    invalidateCruises: () =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.cruises.getAll.key() }),
    invalidateCruiseById: (id: string) =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.cruises.getById.key({ input: { params: { id } } }) }),
    invalidateMeals: () =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.meals.getAll.key() }),
    invalidateMealById: (id: string) =>
      queryClient.invalidateQueries({ queryKey: libraryORPC.meals.getById.key({ input: { params: { id } } }) }),
  };
}

// Blog Client and Invalidation
export function useBlogClient() {
  return createTanstackQueryUtils(client.blog, {
    path: ["blog"],
  });
}

export function useBlogQueryInvalidation() {
  const blogORPC = useBlogClient();
  const queryClient = useQueryClient();

  return {
    invalidateAllPosts: () =>
      queryClient.invalidateQueries({
        queryKey: blogORPC.posts.getAll.key(),
      }),
    invalidatePostById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: blogORPC.posts.getById.key({ input: { params: { id } } }),
      }),
    invalidatePostBySlug: (slug: string) =>
      queryClient.invalidateQueries({
        queryKey: blogORPC.posts.getBySlug.key({ input: { params: { slug } } }),
      }),
    invalidateAllCategories: () =>
      queryClient.invalidateQueries({
        queryKey: blogORPC.categories.getAll.key(),
      }),
    invalidateCategoryById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: blogORPC.categories.getById.key({
          input: { params: { id } },
        }),
      }),
    invalidateAllTags: () =>
      queryClient.invalidateQueries({
        queryKey: blogORPC.tags.getAll.key(),
      }),
    invalidateTagById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: blogORPC.tags.getById.key({ input: { params: { id } } }),
      }),
    invalidateAllBlog: () =>
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "blog";
        },
      }),
  };
}

// Backup Client and Invalidation
export function useBackupClient() {
  return createTanstackQueryUtils(client.backup, {
    path: ["backup"],
  });
}

export function useBackupQueryInvalidation() {
  const backupORPC = useBackupClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: backupORPC.list.key(),
      }),
    invalidateAllBackup: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "backup",
      }),
  };
}

// Settings Client and Invalidation
export function useSettingsClient() {
  return createTanstackQueryUtils(client.settings, {
    path: ["settings"],
  });
}

export function useSettingsQueryInvalidation() {
  const settingsORPC = useSettingsClient();
  const queryClient = useQueryClient();

  return {
    invalidateSettings: () =>
      queryClient.invalidateQueries({
        queryKey: settingsORPC.get.key(),
      }),
    invalidateAllSettings: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "settings",
      }),
  };
}

// CRM Customer Client and Invalidation
export function useCustomerClient() {
  return createTanstackQueryUtils(client.customer, {
    path: ["customer"],
  });
}

export function useCustomerQueryInvalidation() {
  const customerORPC = useCustomerClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: customerORPC.getAll.key(),
      }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: customerORPC.getById.key({ input: { params: { id } } }),
      }),
    invalidateAllCustomers: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "customer",
      }),
  };
}

// CRM Lead Client and Invalidation
export function useLeadClient() {
  return createTanstackQueryUtils(client.lead, {
    path: ["lead"],
  });
}

export function useLeadQueryInvalidation() {
  const leadORPC = useLeadClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: leadORPC.getAll.key(),
      }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: leadORPC.getById.key({ input: { params: { id } } }),
      }),
    invalidateAllLeads: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "lead",
      }),
  };
}

// CRM Customer Document Client and Invalidation
export function useCustomerDocumentClient() {
  return createTanstackQueryUtils(client.customerDocument, {
    path: ["customerDocument"],
  });
}

export function useCustomerDocumentQueryInvalidation() {
  const docORPC = useCustomerDocumentClient();
  const queryClient = useQueryClient();

  return {
    invalidateByCustomerId: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: docORPC.getAllByCustomer.key({ input: { params: { id } } }),
      }),
    invalidateByDocumentId: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: docORPC.getById.key({ input: { params: { id } } }),
      }),
    invalidateAllCustomerDocuments: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "customerDocument",
      }),
  };
}

export function useEnquiryClient() {
  return createTanstackQueryUtils(client.enquiry, { path: ["enquiry"] });
}

export function useEnquiryQueryInvalidation() {
  const enquiryORPC = useEnquiryClient();
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: enquiryORPC.getAll.key() }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: enquiryORPC.getById.key({ input: { params: { id } } }),
      }),
    invalidateAllEnquiries: () =>
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === "enquiry",
      }),
  };
}
