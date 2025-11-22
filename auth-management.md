# Role-Based Authorization PRD

## Overview

- Purpose: add modular role and permission management across the workspace without altering existing authentication. Authorization must be enforced uniformly for backend procedures and available to frontend for conditional UI.
- Scope: roles, permissions, role–permission mappings, user–role assignments, permission checks in middleware, and ORPC contracts/procedures to manage them.
- Out of scope: authentication flows, identity providers, password management.

## Goals

- Centralize authorization rules with clear separation from authentication.
- Provide CRUD for roles and permissions; assign/remove roles to users.
- Enforce permission checks via backend middleware before procedure execution.
- Ensure contracts define strong inputs/outputs with validation and consistent errors.
- Integrate with existing routers and patterns while remaining feature‑modular.

## Non‑Goals

- Replace or modify Better Auth user tables.
- Implement resource‑scoped, multi‑tenant ABAC at this stage; focus on global RBAC with optional resource hints.

## Architecture

- Authorization layer: RBAC with permissions expressed as normalized strings (`resource.action`).
- Data: distinct tables for `Role`, `Permission`, `RolePermission`, `UserRole`. Do not modify Better Auth user.
- Contracts: ORPC contracts in `packages/orpc-contract/src/contracts` with inputs/outputs folders for role/permission operations.
- Middleware: permission‑checking middleware in `apps/backend/src/middlewares` using existing context and error formatting patterns from `ref/orpc.ts`.
- Procedures: feature‑scoped procedures in `modules/feature-auth/src/backend/procedures` consuming contracts; routers composed in backend per `ref/index copy.ts` and structure patterns from `ref/attractions`.
- Context: session injected via existing `injectSession` middleware, user identity available through `context.user`.

## Components

- Data models: `Role`, `Permission`, `RolePermission`, `UserRole` with unique constraints and cascades.
- ORPC contracts: `role.create/update/delete/list`, `permission.create/update/delete/list`, `role.assign/remove`, `role.permissions.set/list`.
- Middleware: `requirePermission(...)` for procedures; optional `requireAnyPermission([...])` and `requireRole(...)` helpers.
- Procedures: implementations that call DB and return contract outputs; reuse `os` and middleware chain composition.
- Frontend helpers: optional exposure of readable permission sets for UI gating via existing `modules/feature-auth/src/frontend/hooks/use-auth.ts`.



## Security Requirements

- Do not modify Better Auth user schema; relate via foreign keys only.
- Enforce authorization in middleware before any procedure logic executes.
- Validate all inputs with Zod; surface `BAD_REQUEST` on validation errors per `ref/orpc.ts` format.
- Use `UNAUTHORIZED` when no session; `FORBIDDEN` when session exists but lacks permissions.
- Avoid leaking existence of protected resources via error messages; return generic messages and codes.
- Maintain auditability: record role/permission changes with timestamps and actors where practical.

## Constraints

- Backward compatibility with existing routers and context.
- Database integrity: unique constraints on names; composite uniques on mappings; cascades for cleanup.
- Performance: indexes on lookup columns; efficient joins to resolve user permissions.

## Integration Points

- Middleware chain in `ref/orpc.ts`: reuse `injectSession`, `isAuthed`, and error formatting; add permission check middleware compatible with `os.middleware`.
- Backend router composition in `ref/index copy.ts`: mount `auth` router beside existing feature routers.
- Contract router pattern in `ref/index.ts`: define `authContracts` and include under `appContracts`.
- Procedure structure in `ref/attractions`: follow `index.ts`, `service.ts`, `types.ts`, `mapper.ts` organization for feature‑local code.
- Feature module: `modules/feature-auth/src/backend` already present; add `procedures` directory with role/permission endpoints.

## Data Model

- `Role(id, name unique, label?, description?, createdAt, updatedAt)`
- `Permission(id, name unique, label?, description?, createdAt, updatedAt)`
- `RolePermission(id, roleId, permissionId, unique(roleId, permissionId), FKs with Cascade)`
- `UserRole(id, userId, roleId, unique(userId, roleId), FKs with Cascade)`
- Indexes:
  - `Role(name)` unique; `Permission(name)` unique
  - `RolePermission(roleId, permissionId)` unique; individual indexes on `roleId`, `permissionId`
  - `UserRole(userId, roleId)` unique; individual indexes on `userId`, `roleId`

## Permission Resolution

- Resolve a user’s permissions by joining roles through `UserRole` → `RolePermission` → `Permission`.
- Cache resolved permission sets in memory per request; optionally add short‑lived cache keyed by `userId` with invalidation on changes.

## ORPC Contracts

- Inputs (Zod): typed payloads for create/update/delete/list, assign/remove, set/list role permissions.
- Outputs: status objects with codes, entities, paginated lists.
- Error handling: standardized codes `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_SERVER_ERROR`.
- Namespacing: `auth.role.*`, `auth.permission.*`, `auth.userRole.*`.

## Middleware Design

- `permissionMiddleware(required: string | string[])`: resolves session, loads user permissions, verifies inclusion, throws `FORBIDDEN` on failure.
- Composability: concatenate with public/private middleware stacks; usable per procedure.
- Logging: reuse timing middleware for observability.

## Procedures

- Role procedures: create, update, delete (soft or hard), list, get by id.
- Permission procedures: create, update, delete, list, get by id.
- Assignment procedures: assign role to user, remove role from user, list roles for user, list permissions for role.
- Validation: strict schemas; prevent deletion of protected default roles/permissions.

## Project Structure Compliance

- Contracts under `packages/orpc-contract/src/contracts` with inputs in `src/inputs` and outputs in `src/outputs`.
- Backend middleware under `apps/backend/src/middlewares`.
- Feature procedures under `modules/feature-auth/src/backend/procedures` following `ref/attractions` patterns.
- Routers combined in backend per `ref/index copy.ts`.

## Scalability

- Modular feature ownership; backend composes routers.
- Clear separation of authN (Better Auth) and authZ (this module).
- Simple to add roles/permissions via contracts and procedures; DB constraints prevent duplicates.

## Quality Assurance

- Contracts include all procedures listed in Procedures section.
- Zod validation on all inputs; strict type inference for outputs.
- Comprehensive error handling; deterministic status codes.
- Documentation of behaviors embedded in contracts and this PRD.

## Migration Strategy

- Create migrations for new tables with required indices and constraints.
- Do not seed any users, roles, or permissions beyond bootstrap behavior.
- Bootstrap behavior: on server start, if there are zero users, automatically create a superuser via Better Auth, create a `superadmin` role, and assign it to the user.

## Testing

- Out of scope for current delivery; no tests required.
- Optional future work: unit tests for permission resolution and middleware checks; contract tests for validation and error codes.

## Observability

- Timing logs per existing middleware; add structured logs on authorization failures.
- Optional metrics: counts of permission denials per endpoint.

## Risks and Mitigations

- Risk: over‑permissive defaults; mitigate with conservative baseline permissions.
- Risk: performance on permission resolution; mitigate with per‑request caching and indexes.
- Risk: accidental deletion of defaults; mitigate with protected flags checked by procedures.

## Milestones

- M1: finalize contracts and DB schema.
- M2: implement middleware and core procedures.
- M3: seed defaults and integrate routers.
- M4: tests, docs, and rollout.

## Assumptions

- Better Auth user table exists and is the source of truth for users.
- ORPC and Zod are available per references.

## Bootstrap Superadmin

- Purpose: guarantee an initial privileged account on first initialization without generic seeding.
- Trigger: server startup in `modules/feature-auth/src/backend` (or the backend entry point).
- Behavior:
  - Count users via Prisma. If any users exist, exit without changes.
  - If zero users, create a superuser using Better Auth APIs (ensures hashing/validations).
  - Create a `superadmin` role and assign it to the newly created user.
  - No additional roles/permissions are created.
- Environment:
  - `SUPERADMIN_EMAIL` default `superadmin@example.com`
  - `SUPERADMIN_PASSWORD` default `ChangeMe123!`
- Example (illustrative):

```ts
import { prisma } from "../prisma";
import { auth } from "../better-auth/server";

export async function bootstrapSuperAdmin() {
  const users = await prisma.user.count();
  if (users > 0) return;

  console.log("⚠ No users found → creating SUPERADMIN");

  const email = process.env.SUPERADMIN_EMAIL ?? "superadmin@example.com";
  const password = process.env.SUPERADMIN_PASSWORD ?? "ChangeMe123!";

  const { user } = await auth.api.user.create({ email, password });

  const role = await prisma.role.create({
    data: {
      name: "superadmin",
      label: "Super Administrator",
      description: "Full system access.",
    },
  });

  await prisma.userRole.create({
    data: { userId: user.id, roleId: role.id },
  });

  console.log("✅ Superadmin created:", email);
}

// Call during server startup
bootstrapSuperAdmin();
```

- Constraints:
  - Do not create other users, roles, or permissions in bootstrap.
  - Avoid terminal commands; initialization runs within server lifecycle.
  - Keep Better Auth user table untouched; only use official API for creation.