import { z } from "zod";

export const ListFilesInput = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  search: z.string().optional(),
});

export type ListFilesInputType = z.input<typeof ListFilesInput>;
