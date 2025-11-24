import { z } from "zod";

export const CreateUserInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const ListUsersInputSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  search: z.string().optional(),
});

export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;
