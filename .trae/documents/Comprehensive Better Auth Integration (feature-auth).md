## Scope & Objectives
- Integrate Better Auth across backend and frontend with environment-specific behavior.
- Implement role-based access (user, admin) and admin operations.
- Provide ORPC contracts for auth flows and user management.
- Minimize schema changes; preserve existing structure and packages.
- Deliver tested, logged, and documented endpoints.

## Documentation Insights
- Admin plugin enables create/list users, ban/unban, impersonation; requires adding server `admin()` and client `adminClient()`.
- Database: Better Auth stores users, sessions, accounts, verification; migration/generate supported. Secondary storage (Redis) optional for sessions/rate limits.
- Email & Password: enable `emailAndPassword.enabled`; client exposes `signUp.email`, `signIn.email`, `signOut`; enable `emailVerification.sendVerificationEmail` for verification flows.

## Database Changes (Minimal)
- Extend `user` to support roles and banning:
  - Add `role` as `String` with default `"user"`.
  - Add `isBanned` as `Boolean` with default `false`.
- No other schema changes. Keep `account`, `session`, `verification` unchanged.
- Reference: `shared/db/schema/user.prisma:1-13`.

## Package: @workspace/feature-auth
### Backend Module
- Create `createAuth` configured by environment.
- Dev: enable `emailAndPassword` only; no mail service; no verification or reset.
- Prod: enable `emailAndPassword` with `requireEmailVerification`, `sendResetPassword`, `onPasswordReset`; enable `emailVerification` hooks; plug in `mailService`.
- Add plugins: `openAPI()`, `expo()`, `admin()`.
- Mirror conventions from `ref/auth.ts:105-133` and the commented full config `ref/auth.ts:32-103`.
- Export types: `Auth`, `Session`, `AuthUser`.

### Frontend Module
- Create `createAuthClient` with base URL and cookie handling.
- Add plugins: `adminClient()`.
- Export helpers: `signUpEmail`, `signInEmail`, `signOut`, `sendVerificationEmail`, `admin.listUsers`, `admin.createUser`, `admin.banUser`, `admin.unbanUser`.

### Shared Module
- Export common types and small utilities: `isAdmin(user)`, `assertNotBanned(user)`.

## Backend Wiring (apps/backend)
- Initialize Prisma: `@shared/db/src/index.ts:9`.
- Instantiate `auth` from `@workspace/feature-auth/backend` `createAuth({ prisma, basePath, trustedOrigins, mailService })`.
- Mount Better Auth routes under `"/api/v1/auth"` in Express.
- Expose OpenAPI endpoint.
- Reference for placement: `apps/backend/src/server.ts:9-15`.

## Role-Based Access & Admin
- Mark admins by `user.role === "admin"` or `adminUserIds` config.
- Enforce `isBanned` on sign-in and session creation.
- Restrict admin operations to admins only.
- Client: expose admin operations via `adminClient()` plugin.

## ORPC Contracts
- Add `auth-contract` covering:
  - `signUpEmail(name, email, password, image?, callbackURL?)`.
  - `signInEmail(email, password, rememberMe?, callbackURL?)`.
  - `signOut()`.
  - `requestPasswordReset(email)`.
  - `resetPassword(token, newPassword)`.
  - `sendVerificationEmail()`.
  - `verifyEmail(token)`.
  - `getSession()`.
- Add `user-contract` covering:
  - `getUserProfile()`.
  - `updateUserProfile(name?, image?)`.
  - `listUsers(query)` supporting filters per admin docs.
  - `banUser(userId)` / `unbanUser(userId)`.
- Keep contracts under `packages/orpc-contract/src/auth-contract` and `packages/orpc-contract/src/user-contract` to match workspace structure; expose through `packages/orpc-client` helpers.

## Environment Configuration
- Detect env via `process.env.NODE_ENV`.
- Dev:
  - `emailAndPassword.enabled: true`.
  - `emailVerification: disabled`.
  - `resetPassword: disabled`.
- Prod:
  - `emailAndPassword.enabled: true`.
  - `emailVerification.sendOnSignUp: true`, `expiresIn: 86400`.
  - `sendResetPassword` and `onPasswordReset` enabled; `revokeSessionsOnPasswordReset: true`.
- Admin IDs via `process.env.ADMIN_USER_IDS`.
- `trustedOrigins` via `process.env.AUTH_TRUSTED_ORIGINS`.
- `advanced.cookiePrefix: "st_auth"`, `crossSubDomainCookies.enabled: true`.

## Error Handling & Logging
- Use `api.onError` to return consistent 500 with structured body while logging `Auth API Error`.
- Wrap ORPC handlers with `try/catch` and return typed error responses.
- Avoid logging secrets; log operation, userId, outcome.

## Tests
- Unit tests for:
  - Sign-up validation (length, uniqueness).
  - Sign-in with correct/incorrect credentials; banned user blocked.
  - Email verification flow.
  - Password reset flow; sessions revoked.
  - Admin listing/ban/unban permissions.
  - ORPC contract type conformance.
- Provide test files under each package; rely on `tsc` for type checks now; runtime tests later.

## Endpoint & Contract Documentation
- Generate OpenAPI via plugin for Better Auth endpoints.
- Document ORPC contracts (names, inputs, outputs, errors) alongside their handlers.
- Provide environment setup guide: required env vars, mail service integration in prod.

## Implementation Sequence
1. Extend Prisma `user` model with `role` and `isBanned`.
2. Implement `@workspace/feature-auth` backend `createAuth` with env-based config, add `admin()`.
3. Implement frontend client with `adminClient()` and helper wrappers.
4. Wire Express routes in `apps/backend/src/server.ts`.
5. Define ORPC contracts and client helpers.
6. Add error handling and logging.
7. Add unit tests and type-check.
8. Provide docs and env guides.

## Key Code References
- Auth factory baseline: `ref/auth.ts:105-133`.
- Full config pattern to mirror in prod: `ref/auth.ts:32-103`.
- Server wiring placeholder: `apps/backend/src/server.ts:9-15`.
- Prisma client export: `shared/db/src/index.ts:9-15`.

Please confirm the plan to proceed with implementation across the monorepo.