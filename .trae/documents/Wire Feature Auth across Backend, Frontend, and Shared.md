## Goal
- Create minimal functionality in `@workspace/feature-auth` for backend, frontend, and shared, and verify imports in `apps/backend` and `apps/frontend-crm` strictly with `tsc --noEmit` (no build output).

## Key Approach (No Build)
- Use TypeScript `paths` in consumer apps to resolve `@workspace/feature-auth/*` directly to source files inside `packages/feature-auth`, avoiding `dist`.
- Do not run `tsc -b` or any emit; only `tsc --noEmit` checks.

## Feature Auth Package (source only)
- Add files:
  - `packages/feature-auth/backend/index.ts`: export `issueToken(userId)`.
  - `packages/feature-auth/frontend/index.ts`: export `formatWelcome(user)`.
  - `packages/feature-auth/shared/index.ts`: export `AuthUser` and `AuthTokenPayload`.
  - `packages/feature-auth/index.ts`: optional root re-exports.
- Keep them dependency-free and small.

## Backend App
- Fix `apps/backend/tsconfig.json` by moving `paths` under `compilerOptions`.
- Add `apps/backend/tsconfig.json` `paths` to resolve feature-auth source directly:
  - `"@workspace/feature-auth/backend": ["../../packages/feature-auth/backend/index.ts"]`
  - `"@workspace/feature-auth/shared": ["../../packages/feature-auth/shared/index.ts"]`
- Add `apps/backend/src/index.ts` minimal Express server using `issueToken` and `AuthUser`.
- Validate with `tsc --noEmit` only.

## Frontend CRM App
- Add `apps/frontend-crm/tsconfig.json` `paths` to resolve feature-auth source directly:
  - `"@workspace/feature-auth/frontend": ["../../packages/feature-auth/frontend/index.ts"]`
  - `"@workspace/feature-auth/shared": ["../../packages/feature-auth/shared/index.ts"]`
- Update `apps/frontend-crm/src/app/page.tsx` to import `formatWelcome` and `AuthUser`, and render a message with a `Button` from `@shared/ui/components/button`.
- Validate with `tsc --noEmit` only.

## Aliases Note
- `apps/frontend-crm/components.json:13-19` aliases are for the shadcn generator and do not affect runtime TS resolution; runtime imports use package exports (e.g., `@shared/ui/components/button`).

## Verification
- Run `tsc --noEmit` in:
  - `packages/feature-auth`
  - `apps/backend`
  - `apps/frontend-crm`
- Confirm import resolution without creating any build artifacts.

If approved, I’ll implement the files and tsconfig path updates, and run only `tsc --noEmit` checks to verify everything without building.