import { prisma } from "@/lib/prisma";

export async function getSnippets(userId: string) {
  return prisma.snippet.findMany({
    where: { userId },
    orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      category: true,
      content: true,
      tags: true,
      isFavorite: true,
      updatedAt: true,
    },
  });
}

export type SnippetRow = Awaited<ReturnType<typeof getSnippets>>[number];
