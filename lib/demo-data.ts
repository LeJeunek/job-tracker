import { addWeeks, startOfWeek, subDays } from "date-fns";

import { ApplicationStatus } from "@/lib/generated/prisma/enums";

import type { DashboardMetrics } from "@/features/dashboard/types";
import type { WeeklyCount } from "@/features/dashboard/queries/get-weekly-applications";
import type { BoardApplication } from "@/features/kanban/types";

export const demoUser = {
  name: "Demo User",
  email: "demo@jobtracker.app",
  image: null as string | null,
};

type SeedApplication = {
  id: string;
  title: string;
  company: string;
  status: BoardApplication["status"];
  priority: BoardApplication["priority"];
  location: string | null;
  remote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  /** createdAt = today − daysAgo, so the board stays fresh no matter when it's viewed */
  daysAgo: number;
  appliedDaysAgo: number | null;
};

const SEED: SeedApplication[] = [
  { id: "demo-11", title: "Full Stack Engineer", company: "Ashby", status: "WISHLIST", priority: "MEDIUM", location: null, remote: true, salaryMin: null, salaryMax: null, daysAgo: 2, appliedDaysAgo: null },
  { id: "demo-10", title: "Product Engineer", company: "Ramp", status: "WISHLIST", priority: "LOW", location: "New York, NY", remote: false, salaryMin: null, salaryMax: null, daysAgo: 3, appliedDaysAgo: null },
  { id: "demo-9", title: "Frontend Engineer", company: "Retool", status: "SAVED", priority: "MEDIUM", location: null, remote: true, salaryMin: null, salaryMax: null, daysAgo: 6, appliedDaysAgo: null },
  { id: "demo-13", title: "Backend Engineer", company: "Supabase", status: "SAVED", priority: "MEDIUM", location: null, remote: true, salaryMin: null, salaryMax: null, daysAgo: 9, appliedDaysAgo: null },
  { id: "demo-8", title: "Full Stack Developer", company: "Shopify", status: "APPLIED", priority: "MEDIUM", location: null, remote: true, salaryMin: 140000, salaryMax: 165000, daysAgo: 12, appliedDaysAgo: 10 },
  { id: "demo-14", title: "Software Engineer", company: "Cloudflare", status: "APPLIED", priority: "HIGH", location: "Austin, TX", remote: false, salaryMin: 150000, salaryMax: 180000, daysAgo: 16, appliedDaysAgo: 14 },
  { id: "demo-1", title: "Senior Frontend Engineer", company: "Stripe", status: "APPLIED", priority: "HIGH", location: null, remote: true, salaryMin: 165000, salaryMax: 195000, daysAgo: 20, appliedDaysAgo: 18 },
  { id: "demo-2", title: "Full Stack Engineer", company: "Vercel", status: "RECRUITER_SCREEN", priority: "HIGH", location: null, remote: true, salaryMin: 150000, salaryMax: 180000, daysAgo: 24, appliedDaysAgo: 21 },
  { id: "demo-3", title: "Product Engineer", company: "Linear", status: "PHONE_SCREEN", priority: "URGENT", location: null, remote: true, salaryMin: 160000, salaryMax: 190000, daysAgo: 27, appliedDaysAgo: 24 },
  { id: "demo-4", title: "Software Engineer, Platform", company: "Notion", status: "TECHNICAL", priority: "MEDIUM", location: null, remote: true, salaryMin: 145000, salaryMax: 170000, daysAgo: 30, appliedDaysAgo: 28 },
  { id: "demo-5", title: "Frontend Infrastructure Engineer", company: "Figma", status: "ONSITE", priority: "HIGH", location: "San Francisco, CA", remote: false, salaryMin: 170000, salaryMax: 200000, daysAgo: 33, appliedDaysAgo: 30 },
  { id: "demo-6", title: "Applied AI Engineer", company: "Anthropic", status: "FINAL_ROUND", priority: "URGENT", location: "San Francisco, CA", remote: false, salaryMin: 180000, salaryMax: 220000, daysAgo: 38, appliedDaysAgo: 35 },
  { id: "demo-7", title: "Senior Software Engineer", company: "Airbnb", status: "OFFER", priority: "HIGH", location: null, remote: true, salaryMin: 175000, salaryMax: 210000, daysAgo: 45, appliedDaysAgo: 42 },
  { id: "demo-12", title: "Senior Engineer", company: "Ghost", status: "REJECTED", priority: "LOW", location: null, remote: true, salaryMin: 130000, salaryMax: 150000, daysAgo: 50, appliedDaysAgo: 47 },
];

function daysFromNow(daysAgo: number) {
  return subDays(new Date(), daysAgo);
}

const positionByStatus = new Map<string, number>();

export const demoApplications: BoardApplication[] = SEED
  .slice()
  .sort((a, b) => b.daysAgo - a.daysAgo)
  .map((seed) => {
    const position = positionByStatus.get(seed.status) ?? 0;
    positionByStatus.set(seed.status, position + 1);
    return {
      id: seed.id,
      title: seed.title,
      status: seed.status,
      priority: seed.priority,
      position,
      location: seed.location,
      remote: seed.remote,
      salaryMin: seed.salaryMin,
      salaryMax: seed.salaryMax,
      salaryCurrency: seed.salaryMin ? "USD" : null,
      appliedAt: seed.appliedDaysAgo !== null ? daysFromNow(seed.appliedDaysAgo) : null,
      createdAt: daysFromNow(seed.daysAgo),
      company: { id: `${seed.id}-company`, name: seed.company },
    };
  });

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

const INTERVIEW_ROUNDS: Partial<Record<ApplicationStatus, number>> = {
  RECRUITER_SCREEN: 1,
  PHONE_SCREEN: 1,
  TECHNICAL: 2,
  ONSITE: 3,
  FINAL_ROUND: 4,
  OFFER: 4,
  ACCEPTED: 4,
  REJECTED: 1,
};

function computeMetrics(): DashboardMetrics {
  const byStatus = {} as Record<ApplicationStatus, number>;
  for (const status of Object.values(ApplicationStatus)) byStatus[status] = 0;
  for (const app of demoApplications) byStatus[app.status]++;

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const totalApplications = demoApplications.length;
  const applicationsThisWeek = demoApplications.filter(
    (a) => a.createdAt >= weekStart
  ).length;
  const appliedCount = demoApplications.filter((a) => a.appliedAt !== null).length;
  const interviewCount = demoApplications.reduce(
    (n, a) => n + (INTERVIEW_ROUNDS[a.status] ?? 0),
    0
  );
  const offerCount = OFFER_STATUSES.reduce((n, s) => n + byStatus[s], 0);
  const respondedCount = RESPONDED_STATUSES.reduce((n, s) => n + byStatus[s], 0);

  return {
    totalApplications,
    applicationsThisWeek,
    appliedCount,
    interviewCount,
    offerCount,
    offerRate: appliedCount > 0 ? offerCount / appliedCount : null,
    responseRate: appliedCount > 0 ? respondedCount / appliedCount : null,
    avgDaysToInterview: 8.5,
    byStatus,
  };
}

export const demoMetrics: DashboardMetrics = computeMetrics();

function computeWeeklyApplications(): WeeklyCount[] {
  const WEEKS = 8;
  const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const rangeStart = addWeeks(currentWeek, -(WEEKS - 1));

  const counts = new Map<number, number>();
  for (const app of demoApplications) {
    const week = startOfWeek(app.createdAt, { weekStartsOn: 1 }).getTime();
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }

  return Array.from({ length: WEEKS }, (_, i) => {
    const weekStart = addWeeks(rangeStart, i);
    return { weekStart, count: counts.get(weekStart.getTime()) ?? 0 };
  });
}

export const demoWeeklyApplications: WeeklyCount[] = computeWeeklyApplications();
