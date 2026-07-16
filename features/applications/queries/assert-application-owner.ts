import { prisma } from "@/lib/prisma";

/**
 * Returns the application if it belongs to the user, else null.
 * Every action that mutates application-scoped data goes through this.
 */
export async function assertApplicationOwner(
  userId: string,
  applicationId: string
) {
  return prisma.application.findFirst({
    where: { id: applicationId, userId },
    select: { id: true, title: true, status: true, appliedAt: true },
  });
}
