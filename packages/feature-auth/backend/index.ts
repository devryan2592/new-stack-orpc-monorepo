import { createPayload } from "../shared/index"

export function issueToken(userId: string): string {
  const payload = createPayload(userId)
  const raw = `${payload.userId}:${payload.issuedAt}`
  return Buffer.from(raw, "utf8").toString("base64")
}