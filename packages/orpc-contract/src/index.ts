import { oc } from "@orpc/contract";
import { rolesContract } from "./contracts/roles";
import { permissionsContract } from "./contracts/permissions";
import { usersContract } from "./contracts/users";

import { galleryContract } from "./contracts/gallery";

export const contractVersion = "0.0.0";
export * from "./contracts/roles";
export * from "./contracts/permissions";
export * from "./contracts/users";
export * from "./contracts/gallery";

export const appContracts = oc.router({
  roles: rolesContract,
  permissions: permissionsContract,
  users: usersContract,
  gallery: galleryContract,
});

export type AppContracts = typeof appContracts;

// Export utility types for contract inference
export type {
  InferContractRouterInputs,
  InferContractRouterOutputs,
  ContractRouterClient,
} from "@orpc/contract";
