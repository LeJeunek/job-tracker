import { startOfWeek } from "date-fns";

import type { DashboardMetrics } from "@/features/dashboard/types";
import { ApplicationStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

/** Statuses that count as "the company responded". */
const RESPONDED_STATUSES: ApplicationStatus[] = [
  "RECRUITER_SCREEN",
  "PHONE_SCREEN",
  "TECHNICAL",
  "ONSITE",
  "FINAL_ROUND",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
];

const OFFER_STATUSES: ApplicationStatus[] = ["OFFER", "ACCEPTED"];

export async function getDashboardMetrics(
  userId: string
): Promise<DashboardMetrics> {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const [statusGroups, appliedCount, interviewCount, thisWeek, avgRows] =
    await Promise.all([
      prisma.application.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.application.count({
        where: { userId, appliedAt: { not: null } },
      }),
      prisma.interview.count({
        where: { application: { userId } },
      }),
      prisma.application.count({
        where: { userId, createdAt: { gte: weekStart } },
      }),
      prisma.$queryRaw<{ avg_days: number | null }[]>`
        SELECT AVG(
          EXTRACT(EPOCH FROM (fi.first_interview - a."appliedAt")) / 86400
        )::float8 AS avg_days
        FROM "Application" a
        JOIN (
          SELECT "applicationId", MIN("scheduledFor") AS first_interview
          FROM "Interview"
          WHERE "scheduledFor" IS NOT NULL
          GROUP BY "applicationId"
        ) fi ON fi."applicationId" = a.id
        WHERE a."userId" = ${userId} AND a."appliedAt" IS NOT NULL
      `,
    ]);

  const byStatus = {} as Record<ApplicationStatus, number>;
  for (const status of Object.values(ApplicationStatus)) {
    byStatus[status] = 0;
  }
  for (const group of statusGroups) {
    byStatus[group.status] = group._count._all;
  }

  const totalApplications = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const offerCount = OFFER_STATUSES.reduce((n, s) => n + byStatus[s], 0);
  const respondedCount = RESPONDED_STATUSES.reduce(
    (n, s) => n + byStatus[s],
    0
  );

  return {
    totalApplications,
    applicationsThisWeek: thisWeek,
    appliedCount,
    interviewCount,
    offerCount,
    offerRate: appliedCount > 0 ? offerCount / appliedCount : null,
    responseRate: appliedCount > 0 ? respondedCount / appliedCount : null,
    avgDaysToInterview: avgRows[0]?.avg_days ?? null,
    byStatus,
  };
}
