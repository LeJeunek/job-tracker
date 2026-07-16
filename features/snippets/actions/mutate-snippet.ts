"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  snippetSchema,
  type SnippetInput,
} from "@/features/snippets/schemas/snippet-schema";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

const updateSchema = snippetSchema.extend({ id: z.cuid() });

export async function updateSnippet(
  input: SnippetInput & { id: string }
): Promise<ActionResult<null>> {
  const user = await requireUser();

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const { id, ...data } = parsed.data;

  try {
    const updated = await prisma.snippet.updateMany({
      where: { id, userId: user.id },
      data,
    });
    if (updated.count === 0) {
      return { success: false, error: "Snippet not found" };
    }

    revalidatePath("/dashboard/snippets");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to update snippet" };
  }
}

export async function deleteSnippet(input: {
  id: string;
}): Promise<ActionResult<null>> {
  const user = await requireUser();

  try {
    const deleted = await prisma.snippet.deleteMany({
      where: { id: input.id, userId: user.id },
    });
    if (deleted.count === 0) {
      return { success: false, error: "Snippet not found" };
    }

    revalidatePath("/dashboard/snippets");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to delete snippet" };
  }
}

export async function toggleFavorite(input: {
  id: string;
  isFavorite: boolean;
}): Promise<ActionResult<null>> {
  const user = await requireUser();

  try {
    const updated = await prisma.snippet.updateMany({
      where: { id: input.id, userId: user.id },
      data: { isFavorite: input.isFavorite },
    });
    if (updated.count === 0) {
      return { success: false, error: "Snippet not found" };
    }

    revalidatePath("/dashboard/snippets");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to update snippet" };
  }
}
