import { z } from "zod";

// Common Params
export const withIdParam = z.object({
  params: z.object({ id: z.string().uuid() }),
});

// Common Responses
export const SuccessResponse = z.object({
  success: z.boolean(),
});

export const ApiResponse = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.boolean().default(true),
    data: schema,
  });
