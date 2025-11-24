import { type Session, type AuthUser } from "@workspace/auth";
import type { Request, Response } from "express";

/**
 * Context for oRPC procedures
 * Contains authentication session, user data, and request/response objects
 */
export interface Context {
  /** Express request object */
  req: Request;
  /** Express response object */
  res: Response;
  /** Normalized headers to be used by middlewares */
  headers: Headers;
  /** Optional user session from Better Auth - filled by middleware */
  session?: Session | null;
  /** Optional authenticated user data - filled by middleware */
  user?: AuthUser | null;
}

/**
 * Authenticated context type for private procedures
 * Guarantees non-null session and user
 */
export interface AuthenticatedContext
  extends Omit<Context, "session" | "user"> {
  /** Guaranteed non-null user session */
  session: Session;
  /** Guaranteed non-null user data */
  user: AuthUser;
}

/**
 * Create oRPC context from Express request and response
 * Retrieves session and user data from Better Auth
 */
export async function createORPCContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> {
  // Normalize incoming headers to a Headers instance
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) {
      const headerValue = Array.isArray(value) ? value.join(", ") : value;
      headers.set(key, headerValue);
    }
  });

  // Return initial context; session/user will be injected via middleware
  return {
    req,
    res,
    headers,
    session: null,
    user: null,
  };
}
