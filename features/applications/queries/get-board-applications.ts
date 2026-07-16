import { prisma } from "@/lib/prisma";
import type { BoardApplication } from "@/features/kanban/types";

export async function getBoardApplications(
  userId: string
): Promise<BoardApplication[]> {
  return prisma.application.findMany({
    where: { userId },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      position: true,
      location: true,
      remote: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      appliedAt: true,
      createdAt: true,
      company: { select: { id: true, name: true } },
    },
  });
}
