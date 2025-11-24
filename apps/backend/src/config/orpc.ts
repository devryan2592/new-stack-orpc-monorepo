import { implement } from "@orpc/server";
import {
  type AppContracts,
  appContracts,
  type InferContractRouterInputs,
  type InferContractRouterOutputs,
} from "@workspace/orpc-contract";
import { ORPCError } from "@orpc/server";
import { ZodError } from "zod";
import { type Context } from "@/context";
import { type Session, type AuthUser } from "@workspace/auth";
import { auth } from "@/auth";

const implementor = implement<AppContracts>(appContracts);

const os = implementor.$context<Context>();

/**
 * Error formatting middleware
 * Converts ZodError to proper ORPC error format
 */
const errorFormattingMiddleware = os.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Validation error",
        cause: error.errors,
      });
    }
    throw error;
  }
});

/**
 * Timing middleware
 * Logs execution time for each procedure call
 */
const timingMiddleware = os.middleware(async ({ next, path }) => {
  const start = Date.now();

  try {
    return await next();
  } finally {
    console.log(
      `[oRPC] ${path.join("/")} took ${Date.now() - start}ms to execute`
    );
  }
});

/**
 * Session injection middleware
 * Reads headers from initial context and injects session/user
 */
const injectSession = os.middleware(async ({ context, next }) => {
  try {
    const response = await auth.api.getSession({ headers: context.headers });
    return next({
      context: {
        session: response?.session ?? null,
        user: response?.user ?? null,
      },
    });
  } catch (error) {
    // Proceed without session if lookup fails
    return next({
      context: {
        session: null,
        user: null,
      },
    });
  }
});

/**
 * Authentication middleware
 * Ensures a valid session exists and provides typed session/user context
 */
const isAuthed = os.middleware(({ context, next }) => {
  // Check if session exists and is valid
  if (!context.session || !context.user) {
    throw new ORPCError("UNAUTHORIZED", {
      message:
        "Authentication required. Please log in to access this resource.",
    });
  }

  // Create authenticated context with guaranteed non-null session and user
  const authenticatedContext = {
    ...context,
    session: context.session as Session,
    user: context.user as AuthUser,
  };

  return next({
    context: authenticatedContext,
  });
});

/**
 * Public procedure: no authentication required
 * Includes error formatting and timing middleware
 */
const publicMiddleware = os
  .middleware(async ({ next }) => {
    return next();
  })
  .concat(errorFormattingMiddleware)
  .concat(timingMiddleware);

/**
 * Private procedure: requires authentication
 * Includes all public middleware plus authentication check
 */
const privateMiddleware = publicMiddleware
  .concat(injectSession)
  .concat(isAuthed);

export const publicProcedure = os.use(publicMiddleware);
export const privateProcedure = os.use(privateMiddleware);

export { os };

// Input and Output types for contract inference
export type Inputs = InferContractRouterInputs<typeof appContracts>;
export type Outputs = InferContractRouterOutputs<typeof appContracts>;

// Re-export auth types for convenience
export type { Session, AuthUser } from "@workspace/auth";
export type { Context, AuthenticatedContext } from "@/context";
