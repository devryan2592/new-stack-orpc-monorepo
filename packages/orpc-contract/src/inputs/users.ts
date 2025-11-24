import { z } from "zod";

export const CreateUserInput = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ListUsersInput = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  search: z.string().optional(),
});

export type CreateUserInputType = z.input<typeof CreateUserInput>;
export type ListUsersInputType = z.input<typeof ListUsersInput>;
