import "dotenv/config";
import path from "path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "schema"),
  migrations: {
    path: path.join(__dirname, "migrations"),
    // seed: "tsx src/seed.ts",
  },
  // Production-ready configuration

  datasource: {
    url: env("DATABASE_URL"),
  },
});
