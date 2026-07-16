import type { ApplicationStatus } from "@/lib/generated/prisma/enums";

export type DashboardMetrics = {
  totalApplications: number;
  applicationsThisWeek: number;
  appliedCount: number;
  interviewCount: number;
  offerCount: number;
  /** offers / applied, 0..1, null when nothing applied yet */
  offerRate: number | null;
  /** applications with any response / applied, 0..1, null when nothing applied yet */
  responseRate: number | null;
  /** average days from appliedAt to first scheduled interview, null when no data */
  avgDaysToInterview: number | null;
  byStatus: Record<ApplicationStatus, number>;
};
