import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import type { Prisma } from "@shared/db";

export interface MailService {
  sendPasswordResetEmail: (
    params: { user: any; url: string; token: string },
    request?: any
  ) => Promise<void>;
  sendVerificationEmail: (
    params: { user: any; url: string; token: string },
    request?: any
  ) => Promise<void>;
  sendWelcomeEmail: (params: { user: any }, request?: any) => Promise<void>;
  sendPasswordChangeConfirmation: (
    params: { user: any },
    request?: any
  ) => Promise<void>;
  sendEmailVerificationConfirmation: (
    params: { user: any },
    request?: any
  ) => Promise<void>;
}

export interface AuthConfig {
  prisma: Prisma;
  basePath?: string;
  baseURL?: string;
  trustedOrigins?: string[];
  adminUserIds?: string[];
  mailService?: MailService;
}

export function createAuth(config: AuthConfig): ReturnType<typeof betterAuth> {
  const basePath = config.basePath || "/api/v1/auth";
  const nodeEnv = (globalThis as any).process?.env?.NODE_ENV || "development";
  const isProd = nodeEnv === "production";

  return betterAuth({
    database: prismaAdapter(config.prisma, { provider: "postgresql" }),
    baseURL: config.baseURL || "http://localhost:8000",
    basePath,
    trustedOrigins: config.trustedOrigins,
    emailAndPassword: {
      enabled: true,
      ...(isProd && config.mailService
        ? {
          sendResetPassword: async ({ user, url, token }, request) => {
            await config.mailService!.sendPasswordResetEmail(
              { user, url, token },
              request
            );
          },
          onPasswordReset: async (data, request) => {
            await config.mailService!.sendPasswordChangeConfirmation(
              { user: data.user },
              request
            );
          },
          revokeSessionsOnPasswordReset: true,
          resetPasswordTokenExpiresIn: 60 * 5,
          requireEmailVerification: true,
        }
        : {}),
    },
    ...(isProd && config.mailService
      ? {
        emailVerification: {
          sendOnSignUp: true,
          expiresIn: 60 * 60 * 24,
          sendVerificationEmail: async ({ user, url, token }, request) => {
            await config.mailService!.sendVerificationEmail(
              { user, url, token },
              request
            );
          },
          onEmailVerification: async (user, request) => {
            await config.mailService!.sendEmailVerificationConfirmation(
              { user },
              request
            );
          },
          afterEmailVerification: async (user, request) => {
            setTimeout(async () => {
              await config.mailService!.sendWelcomeEmail({ user }, request);
            }, 3000);
          },
        },
      }
      : {}),
    advanced: {
      cookiePrefix: "st_auth",
      crossSubDomainCookies: { enabled: true },
    },
    api: {
      onError: (error: any) => {
        console.error("Auth API Error:", error);
        return {
          status: 500,
          body: { message: "Internal server error" },
        };
      },
    },
    plugins: [openAPI(), admin(), expo()],
  });
}


export type Auth = ReturnType<typeof createAuth>;
export type Session = Auth["$Infer"]["Session"]["session"];
export type AuthUser = Auth["$Infer"]["Session"]["user"];
