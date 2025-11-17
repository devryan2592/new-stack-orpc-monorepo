import express, { type Express, type Request, type Response } from "express";
import { issueToken } from "@workspace/feature-auth/backend";
import type { AuthUser } from "@workspace/feature-auth/shared";

const app: Express = express();

app.get("/health", (req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/token/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const token = issueToken(id ?? "undefined");
  res.json({ token });
});

app.listen(3001, () => {
  const user: AuthUser = { id: "1", name: "Alice" };
  void user;
  console.log("Backend server listening on http://localhost:3001");
});

export default app;
