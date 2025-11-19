Title: Auth Implementation Decisions

Overview
- Better Auth used for auth flows and admin ops.
- Prisma adapter with Postgres, minimal schema changes: add `role`, `isBanned` to `user`.

Environment Separation
- Development: email/password only; no email verification or reset.
- Production: enable email verification and password reset via `mailService` hooks; revoke sessions on reset.

Admin
- Server plugin `admin()`; client plugin `adminClient()`.
- Admin determined by `user.role === "admin"` or `ADMIN_USER_IDS` env.
- Enforce `isBanned` on sign-in/session-sensitive actions.

Security & Error Handling
- Credentials handled by Better Auth; no plaintext logging.
- `api.onError` returns structured 500 and logs error.

OpenAPI
- `openAPI()` plugin enabled; exposed via Better Auth API.

Secondary Storage
- Optional Redis via `secondaryStorage` when environment provides Redis config.