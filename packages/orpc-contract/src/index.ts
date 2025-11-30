import { oc } from "@orpc/contract";
import { rolesContract } from "./contracts/roles";
import { permissionsContract } from "./contracts/permissions";
import { usersContract } from "./contracts/users";
import { galleryContract } from "./contracts/gallery";
import { filesContract } from "./contracts/files";
import { customersContract } from "./contracts/customers";
import { leadsContract } from "./contracts/leads";

export const contractVersion = "0.0.0";

export * from "./contracts";
export * from "./inputs";
export * from "./outputs";

export const appContracts = oc.router({
  roles: rolesContract,
  permissions: permissionsContract,
  users: usersContract,
  gallery: galleryContract,
  files: filesContract,
  customers: customersContract,
  leads: leadsContract,
});

export type AppContracts = typeof appContracts;

// Export utility types for contract inference
export type {
  InferContractRouterInputs,
  InferContractRouterOutputs,
  ContractRouterClient,
} from "@orpc/contract";
