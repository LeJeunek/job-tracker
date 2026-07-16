"use server";

import { revalidatePath } from "next/cache";

import {
  snippetSchema,
  type SnippetInput,
} from "@/features/snippets/schemas/snippet-schema";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

export async function createSnippet(
  input: SnippetInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = snippetSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const data = parsed.data;

  try {
    const snippet = await prisma.snippet.create({
      data: {
        userId: user.id,
        title: data.title,
        category: data.category,
        content: data.content,
        tags: data.tags,
        isFavorite: data.isFavorite,
      },
    });

    revalidatePath("/dashboard/snippets");
    return { success: true, data: { id: snippet.id } };
  } catch {
    return { success: false, error: "Failed to create snippet" };
  }
}
