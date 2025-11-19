Title: Auth Environment Configuration Guide

Env Vars
- `NODE_ENV`: `development` | `production`.
- `AUTH_TRUSTED_ORIGINS`: comma-separated origins.
- `ADMIN_USER_IDS`: comma-separated user IDs with admin privileges.
- `BETTER_AUTH_SECRET`: required by Better Auth.
- `BETTER_AUTH_URL`: base URL of app.

Development
- No email verification or password reset.
- Routes mounted under `/api/v1/auth/*`.

Production
- Email verification enabled; expires in 24h.
- Password reset enabled; sessions revoked on reset.
- Provide `mailService` implementation for email hooks.

Express Integration
- Mount handler: `app.all("/api/v1/auth/*", toNodeHandler(auth))`.
- Place `express.json()` after the handler.