import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
  basePath: "/api/v1/auth",
});

export const signUpEmail = authClient.signUp.email;
export const signInEmail = authClient.signIn.email;
export const signOut = authClient.signOut;
