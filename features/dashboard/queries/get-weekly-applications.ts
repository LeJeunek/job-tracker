import { addWeeks, startOfWeek } from "date-fns";

import { prisma } from "@/lib/prisma";

export type WeeklyCount = {
  weekStart: Date;
  count: number;
};

const WEEKS = 8;

/**
 * Applications created per week for the last 8 weeks (missing weeks = 0).
 * Buckets in JS local time — date_trunc in SQL groups by UTC weeks, which
 * shifts boundary rows into the wrong local week.
 */
export async function getWeeklyApplications(
  userId: string
): Promise<WeeklyCount[]> {
  const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const rangeStart = addWeeks(currentWeek, -(WEEKS - 1));

  const rows = await prisma.application.findMany({
    where: { userId, createdAt: { gte: rangeStart } },
    select: { createdAt: true },
  });

  const counts = new Map<number, number>();
  for (const row of rows) {
    const week = startOfWeek(row.createdAt, { weekStartsOn: 1 }).getTime();
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }

  return Array.from({ length: WEEKS }, (_, i) => {
    const weekStart = addWeeks(rangeStart, i);
    return { weekStart, count: counts.get(weekStart.getTime()) ?? 0 };
  });
}
