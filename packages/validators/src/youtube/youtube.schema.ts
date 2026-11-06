import { z } from "zod";

export const youtubeSearchSchema = z.compile(
  z.object({
    query: z
      .string()
      .trim()
      .min(1, "Search query is required")
      .max(200, "Search query is too long"),

    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
);

export type YoutubeSearchInput = z.infer<typeof youtubeSearchSchema>;
