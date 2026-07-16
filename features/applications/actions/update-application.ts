"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertApplicationOwner } from "@/features/applications/queries/assert-application-owner";
import { applicationSchema } from "@/features/applications/schemas/application-schema";
import { statusLabel } from "@/features/kanban/columns";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

const updateSchema = applicationSchema.extend({ id: z.cuid() });

export type UpdateApplicationInput = z.infer<typeof updateSchema>;

export async function updateApplication(
  input: UpdateApplicationInput
): Promise<ActionResult<null>> {
  const user = await requireUser();

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const data = parsed.data;

  try {
    const existing = await assertApplicationOwner(user.id, data.id);
    if (!existing) {
      return { success: false, error: "Application not found" };
    }

    const company = await prisma.company.upsert({
      where: { userId_name: { userId: user.id, name: data.companyName } },
      update: {},
      create: { userId: user.id, name: data.companyName },
    });

    const statusChanged = existing.status !== data.status;
    let position: number | undefined;
    if (statusChanged) {
      const max = await prisma.application.aggregate({
        where: { userId: user.id, status: data.status },
        _max: { position: true },
      });
      position = (max._max.position ?? -1) + 1;
    }

    await prisma.application.update({
      where: { id: data.id },
      data: {
        companyId: company.id,
        title: data.title,
        status: data.status,
        priority: data.priority,
        location: data.location || null,
        remote: data.remote,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        salaryCurrency: data.salaryMin || data.salaryMax ? "USD" : null,
        applicationUrl: data.applicationUrl || null,
        source: data.source || null,
        notes: data.notes || null,
        ...(position !== undefined ? { position } : {}),
        ...(statusChanged && data.status === "APPLIED" && !existing.appliedAt
          ? { appliedAt: new Date() }
          : {}),
        activities: {
          create: statusChanged
            ? {
                type: "STATUS_CHANGED",
                message: `Moved to ${statusLabel(data.status)}`,
              }
            : { type: "UPDATED", message: "Updated application details" },
        },
      },
    });

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard/applications/[id]", "page");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to update application" };
  }
}
