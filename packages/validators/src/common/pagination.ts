import { z } from "zod";

export const paginationSchema = z.compile(
  z.object({
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
);

export type PaginationInput = z.infer<typeof paginationSchema>;
