import { AuthUser } from "@/hooks/use-auth";

export function isAdmin(user: AuthUser | null | undefined): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => ["superadmin", "admin"].includes(role.name));
}

export function isSuperAdmin(user: AuthUser | null | undefined): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => role.name === "superadmin");
}
