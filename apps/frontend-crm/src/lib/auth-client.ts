import { createAuthClient } from "@workspace/auth";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
  basePath: "/api/v1/auth",
  plugins: [],
  fetchOptions: {
    credentials: "include",
  },
});
