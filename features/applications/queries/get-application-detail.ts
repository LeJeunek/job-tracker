import { prisma } from "@/lib/prisma";

export async function getApplicationDetail(userId: string, id: string) {
  return prisma.application.findFirst({
    where: { id, userId },
    include: {
      company: true,
      contacts: { orderBy: { name: "asc" } },
      interviews: {
        orderBy: [{ scheduledFor: { sort: "asc", nulls: "last" } }],
      },
      tasks: {
        orderBy: [{ completed: "asc" }, { dueDate: { sort: "asc", nulls: "last" } }],
      },
      activities: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
}

export type ApplicationDetail = NonNullable<
  Awaited<ReturnType<typeof getApplicationDetail>>
>;
