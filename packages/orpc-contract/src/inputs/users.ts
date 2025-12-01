import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const listUsersSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  search: z.string().optional(),
  roles: z.array(z.string()).optional(),
});

export type CreateUserInputType = z.input<typeof createUserSchema>;
export type ListUsersInputType = z.input<typeof listUsersSchema>;
