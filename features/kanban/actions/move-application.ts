"use server";

import { revalidatePath } from "next/cache";

import {
  moveApplicationSchema,
  type MoveApplicationInput,
} from "@/features/applications/schemas/application-schema";
import { statusLabel } from "@/features/kanban/columns";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

export async function moveApplication(
  input: MoveApplicationInput
): Promise<ActionResult<null>> {
  const user = await requireUser();

  const parsed = moveApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid move" };
  }
  const { id, status, index } = parsed.data;

  try {
    const application = await prisma.application.findFirst({
      where: { id, userId: user.id },
      select: { id: true, status: true, appliedAt: true },
    });
    if (!application) {
      return { success: false, error: "Application not found" };
    }

    const columnApps = await prisma.application.findMany({
      where: { userId: user.id, status },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      select: { id: true },
    });

    const ids = columnApps.map((a) => a.id).filter((appId) => appId !== id);
    ids.splice(Math.min(index, ids.length), 0, id);

    const statusChanged = application.status !== status;
    const setAppliedAt =
      statusChanged && status === "APPLIED" && !application.appliedAt;

    await prisma.$transaction([
      ...ids.map((appId, position) =>
        prisma.application.update({
          where: { id: appId },
          data: {
            position,
            ...(appId === id
              ? { status, ...(setAppliedAt ? { appliedAt: new Date() } : {}) }
              : {}),
          },
        })
      ),
      ...(statusChanged
        ? [
            prisma.activity.create({
              data: {
                applicationId: id,
                type: "STATUS_CHANGED",
                message: `Moved to ${statusLabel(status)}`,
              },
            }),
          ]
        : []),
    ]);

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard/applications/[id]", "page");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to move application" };
  }
}
