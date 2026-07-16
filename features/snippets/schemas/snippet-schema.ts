import { z } from "zod";

import { SnippetCategory } from "@/lib/generated/prisma/enums";

export const snippetSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  category: z.enum(SnippetCategory),
  content: z.string().trim().min(1, "Content is required").max(50000),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  isFavorite: z.boolean().default(false),
});

export type SnippetInput = z.input<typeof snippetSchema>;
