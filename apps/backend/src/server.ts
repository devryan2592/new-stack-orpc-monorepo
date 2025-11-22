import express, { Express } from "express";
import dotenv from "dotenv";
import { auth, bootstrapSuperAdmin } from "./auth";
import { toNodeHandler } from "@workspace/auth";
import cors from "cors";
import { corsConfig } from "./config/cors";

// Load environment variables from .env file
dotenv.config();

const app: Express = express();

app.use(cors(corsConfig));

// Auth Routes (Better Auth)
app.use("/api/v1/auth", toNodeHandler(auth));

// Apply express.json AFTER Better Auth handler
app.use(express.json());

bootstrapSuperAdmin(auth);

// RPC Handler

// OpenAPI Handler

//  ORPC routes

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
