export type AuthUser = {
  id: string
  name: string
}

export type AuthTokenPayload = {
  userId: string
  issuedAt: number
}

export function createPayload(userId: string): AuthTokenPayload {
  return { userId, issuedAt: Date.now() }
}