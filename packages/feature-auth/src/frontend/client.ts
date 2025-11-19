import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
  basePath: "/api/v1/auth",
  plugins: [adminClient()],
});

export const signUpEmail = authClient.signUp.email;
export const signInEmail = authClient.signIn.email;
export const signOut = authClient.signOut;

export const admin = authClient.admin;
