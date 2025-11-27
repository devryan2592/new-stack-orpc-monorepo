// ORPC Client Package - Main Exports

// ===== React Components & Providers =====
export { ORPCReactProvider, getBrowserQueryClient } from "./lib/provider";
export { HydrateClient, getQueryClient } from "./lib/hydration";

// ===== Query Client Utilities =====
export { createQueryClient } from "./lib/query-client";

// ===== RPC Link & Connection =====
export { createRPCLink, getBaseURL } from "./lib/link";

// ===== Server-Side Utilities =====
export { serverCaller, client } from "./lib/server-caller";

// ===== Serialization =====
export { serializer } from "./lib/serializer";

// ===== Hooks =====
export * from "./utils";
export * from "./hooks/use-roles";
export * from "./hooks/use-permissions";
export * from "./hooks/use-users";
export * from "./hooks/use-gallery";
export * from "./hooks/use-files";
export * from "./hooks/use-customers";
export * from "./hooks/use-leads";

export { useInfiniteQuery } from "@tanstack/react-query";
