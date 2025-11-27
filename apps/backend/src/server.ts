import express, { Express } from "express";
import dotenv from "dotenv";
import { auth, bootstrapSuperAdmin, bootstrapPermissions } from "./auth";
import { toNodeHandler } from "@workspace/auth";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { CORSPlugin } from "@orpc/server/plugins";

// Load environment variables from .env file
dotenv.config();

const app: Express = express();

app.use(cors(corsConfig));

// Auth Routes (Better Auth)
app.use("/api/v1/auth", toNodeHandler(auth));

// Apply express.json AFTER Better Auth handler
app.use(express.json());

bootstrapSuperAdmin(auth);
bootstrapPermissions(["destination", "attraction", "tour", "blog", "user"]);

// UploadThing Handler
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./procedures/files/uploadthing";

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  })
);

// ORPC Handler
import { RPCHandler } from "@orpc/server/node";
import { router } from "./router";
import { createORPCContext } from "./context";

const rpcHandler = new RPCHandler(router, {
  plugins: [new CORSPlugin(corsConfig)],
});

app.use("/api/v1/orpc", async (req, res, next) => {
  const context = await createORPCContext({ req, res });
  await rpcHandler.handle(req, res, {
    prefix: "/api/v1/orpc",
    context,
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
