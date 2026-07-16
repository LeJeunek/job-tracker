"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertApplicationOwner } from "@/features/applications/queries/assert-application-owner";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

const deleteSchema = z.object({ id: z.cuid() });

export async function deleteApplication(input: {
  id: string;
}): Promise<ActionResult<null>> {
  const user = await requireUser();

  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  try {
    const existing = await assertApplicationOwner(user.id, parsed.data.id);
    if (!existing) {
      return { success: false, error: "Application not found" };
    }

    // Contacts, interviews, tasks, activities, and documents cascade.
    await prisma.application.delete({ where: { id: existing.id } });

    revalidatePath("/dashboard/applications");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to delete application" };
  }
}
