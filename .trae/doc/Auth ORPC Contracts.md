Title: Auth ORPC Contracts

AuthContract
- signUpEmail(input): creates user and session; returns user.
- signInEmail(input): creates session; returns user.
- signOut(): invalidates session.
- requestPasswordReset(input): sends reset email (prod only).
- resetPassword(input): resets password; revokes sessions (prod only).
- sendVerificationEmail(): triggers verification mail (prod only).
- verifyEmail(input): verifies email token.
- getSession(): returns current user and session.

UserContract
- getUserProfile(): returns current user.
- updateUserProfile(input): updates name/image.
- listUsers(query): admin-only; supports search/filter/sort/pagination.
- banUser(userId): admin-only; sets `isBanned`.
- unbanUser(userId): admin-only; clears `isBanned`.

Errors
- Standard shape: `{ ok: false, error }`.