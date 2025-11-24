import type {
  AppContracts,
  ContractRouterClient,
} from "@workspace/orpc-contract";
import { createRPCLink } from "./link";
import { createORPCClient } from "@orpc/client";

export function createClient(): ContractRouterClient<AppContracts> {
  const link = createRPCLink();
  return createORPCClient(link);
}

export const client = createClient();

export const serverCaller = createClient();
