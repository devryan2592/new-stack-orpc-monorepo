import { oc } from "@orpc/contract";
import {
  blogContracts,
  galleryContracts,
  seoContracts,
  attractionContracts,
  tourContracts,
  destinationContracts,
  settingsContracts,
  backupContracts,
  customerContracts,
  leadContracts,
  customerDocumentContracts,
  enquiryContracts,
  itineraryContracts,
  libraryContracts,
} from "./contracts";

export const appContracts = oc.router({
  blog: blogContracts,
  gallery: galleryContracts,
  seo: seoContracts,
  attraction: attractionContracts,
  tour: tourContracts,
  destination: destinationContracts,
  backup: backupContracts,
  settings: settingsContracts,
  customer: customerContracts,
  lead: leadContracts,
  customerDocument: customerDocumentContracts,
  enquiry: enquiryContracts,
  itinerary: itineraryContracts,
  library: libraryContracts,
});

export type AppContracts = typeof appContracts;

export * from "./inputs";
export * from "./outputs";
export * from "./contracts";
export * from "./shared";

// Export utility types for contract inference
export type {
  InferContractRouterInputs,
  InferContractRouterOutputs,
  ContractRouterClient,
} from "@orpc/contract";
