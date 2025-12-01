import { z } from "zod";

export const FileOutputSchema = z.object({
  id: z.string(),
  key: z.string(),
  url: z.string(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedAt: z.date(),
  uploaderId: z.string(),
});

export type FileOutputType = z.infer<typeof FileOutputSchema>;
