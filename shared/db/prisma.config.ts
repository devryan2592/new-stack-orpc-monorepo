import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "schema"),
  migrations: {
    path: path.join(__dirname, "migrations"),
    // seed: "tsx src/seed.ts",
  },
  // Production-ready configuration
  experimental: {
    adapter: false,
    externalTables: false,
    // studio: false,
  },
});
