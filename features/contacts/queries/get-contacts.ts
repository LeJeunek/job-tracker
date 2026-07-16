import { prisma } from "@/lib/prisma";

export async function getContacts(userId: string) {
  return prisma.contact.findMany({
    where: { application: { userId } },
    orderBy: [{ followUp: { sort: "asc", nulls: "last" } }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      title: true,
      email: true,
      phone: true,
      linkedin: true,
      notes: true,
      lastContacted: true,
      followUp: true,
      application: {
        select: {
          id: true,
          title: true,
          status: true,
          company: { select: { name: true } },
        },
      },
    },
  });
}

export type ContactRow = Awaited<ReturnType<typeof getContacts>>[number];
