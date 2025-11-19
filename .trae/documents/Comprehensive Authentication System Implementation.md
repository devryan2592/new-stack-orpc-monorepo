## Backend Authentication
- Use existing `createAuth` built on better-auth and Prisma (`packages/feature-auth/src/backend/auth.ts:36`) to provide secure endpoints under `basePath` (`/api/v1/auth`).
- Add JWT utilities for first‑party APIs:
  - `issueJwt(user)` and `verifyJwt(token)` using `process.env.AUTH_JWT_SECRET`, HS256, 15m expiry, typed payload `{ sub, email, name }`.
  - Place in `packages/feature-auth/src/backend/jwt.ts`; export in `packages/feature-auth/src/backend/index.ts`.
- Expose Next.js route handler adapter:
  - Use already exported `toNodeHandler` and `createAuth` (`packages/feature-auth/src/index.ts:1,10`).
  - In CRM app, add `src/app/api/v1/auth/[...auth]/route.ts` that imports a configured `auth` and re-exports `toNodeHandler(auth)` for GET/POST.
- Provide mail service placeholder:
  - Implement `DefaultMailService` mock logging to console that satisfies `MailService` (`packages/feature-auth/src/backend/auth.ts:8-26`).
  - Use in non‑production or when concrete service is not provided.
- Error handling: keep centralized `api.onError` (`packages/feature-auth/src/backend/auth.ts:96-105`) and ensure JWT utilities throw typed errors.

## Frontend Forms
- Port responsive forms from `ref/auth-forms/*` into `apps/frontend-crm/src/components/forms`:
  - `login-form.tsx`, `register-form.tsx`, `reset-password-request-form.tsx`, `update-password-form.tsx`, `verify-email-form.tsx`.
  - Align UI imports to `@shared/ui` to match app usage, keep `react-hook-form + zod` validation.
- Create `apps/frontend-crm/src/lib/auth-client.ts` that re-exports `authClient` from `@workspace/feature-auth/frontend` and sets `baseUrl` if needed.
- Create `apps/frontend-crm/src/lib/links.ts` defining `AUTH_LINKS` and `DASHBOARD_LINKS` used by forms.
- Ensure robust error handling and typed props as in refs; keep accessible, responsive design.

## Auth Guard Component
- Create `apps/frontend-crm/src/components/auth-guard.tsx` using `ref/auth-guard.tsx`:
  - Client component that calls `authClient.getSession()` and redirects unauthenticated users to `AUTH_LINKS.LOGIN`.
  - Provide `AuthProvider` and `useAuth` for session data sharing.
- JWT validation and refresh:
  - Guard relies on cookie session; for API calls needing JWT, add helper to request `/api/v1/auth/token` and auto-refresh when expired. Store JWT in memory and re-issue from session when needed.

## Package Management
- Update `packages/feature-auth/package.json`:
  - Add `peerDependencies`: `next`, `react`, `react-dom`.
  - Keep `better-auth` in `dependencies`; do not include form libs here (used by app).
  - Export new `backend/jwt.ts` through existing `exports` map.
- Ensure TypeScript config remains consistent; no runtime secrets committed.

## CRM Integration
- App Router navigation:
  - Add `apps/frontend-crm/src/app/auth/layout.tsx` mirroring `ref/pages/layout.tsx`.
  - Add pages:
    - `auth/login/page.tsx` -> uses `LoginForm` (`ref/pages/login/page.tsx`).
    - `auth/register/page.tsx` -> uses `RegisterForm`.
    - `auth/reset-password/page.tsx` -> uses `ResetPasswordRequestForm`.
    - `auth/update-password/page.tsx` -> uses `UpdatePasswordForm` with `searchParams.token`.
    - `auth/verify-email/page.tsx` -> uses `VerifyEmailForm`.
  - Create protected routes:
    - `apps/frontend-crm/src/app/dashboard/page.tsx` wraps content in `AuthGuard`.
- Reference `ref/auth/index.ts` to configure `auth` instance in `apps/frontend-crm/src/lib/auth.ts`:
  - Import `createAuth` from `@workspace/feature-auth` and `prisma` from `@shared/db`.
  - Set `basePath` `/api/v1/auth`, `trustedOrigins`, and pass `DefaultMailService` for development.

## Security, Typing, Docs
- Use strong password rules and email verification as in better-auth config; revoke sessions on password reset (`packages/feature-auth/src/backend/auth.ts:61-66`).
- Never log secrets; read `AUTH_JWT_SECRET` from env.
- Fully typed interfaces for `AuthUser`, `Session`, JWT payload, MailService.
- Document interfaces and components inline (JSDoc) across package and app.

## Unit Tests
- Add unit tests for JWT:
  - `packages/feature-auth/src/backend/__tests__/jwt.test.ts` covering sign/verify, expiry, invalid signature.
- Add client tests for form validators (zod schemas) and a mock of `authClient` interactions.
- Type-check the workspace with `tsc` after implementation.

## Deliverables
- Backend auth configured and exposed via Next.js API route.
- JWT utility for first‑party API auth.
- Responsive, validated forms integrated in CRM app.
- AuthGuard with session management and JWT refresh helper.
- Package peerDependencies updated.
- Protected CRM routes and sample dashboard.
- Unit tests and TypeScript types in place.
