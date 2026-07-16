import { prisma } from "@/lib/prisma";

/** Lightweight list for "attach to application" selects. */
export async function getApplicationOptions(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      company: { select: { name: true } },
    },
  });
}

export type ApplicationOption = Awaited<
  ReturnType<typeof getApplicationOptions>
>[number];
