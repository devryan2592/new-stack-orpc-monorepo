import type { AuthUser } from "../shared/index"

export function formatWelcome(user: AuthUser): string {
  return `Welcome, ${user.name}`
}