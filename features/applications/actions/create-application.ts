"use server";

import { revalidatePath } from "next/cache";

import {
  applicationSchema,
  type ApplicationInput,
} from "@/features/applications/schemas/application-schema";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

export async function createApplication(
  input: ApplicationInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const data = parsed.data;

  try {
    const company = await prisma.company.upsert({
      where: { userId_name: { userId: user.id, name: data.companyName } },
      update: {},
      create: { userId: user.id, name: data.companyName },
    });

    const maxPosition = await prisma.application.aggregate({
      where: { userId: user.id, status: data.status },
      _max: { position: true },
    });

    const application = await prisma.application.create({
      data: {
        userId: user.id,
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
        position: (maxPosition._max.position ?? -1) + 1,
        appliedAt: data.status === "APPLIED" ? new Date() : null,
        activities: {
          create: {
            type: "CREATED",
            message: `Added ${data.title} at ${company.name}`,
          },
        },
      },
    });

    revalidatePath("/dashboard/applications");
    return { success: true, data: { id: application.id } };
  } catch {
    return { success: false, error: "Failed to create application" };
  }
}
