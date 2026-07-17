import { MetricCard } from "@/features/dashboard/components/metric-card";
import { PipelineBreakdown } from "@/features/dashboard/components/pipeline-breakdown";
import { WeeklyChart } from "@/features/dashboard/components/weekly-chart";
import { getDashboardMetrics } from "@/features/dashboard/queries/get-dashboard-metrics";
import { getWeeklyApplications } from "@/features/dashboard/queries/get-weekly-applications";
import { PageHeader } from "@/components/shared/page-header";
import { requireUser } from "@/lib/session";

function percent(value: number | null) {
  if (value === null) return "—";
  return `${Math.round(value * 100)}%`;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [metrics, weeks] = await Promise.all([
    getDashboardMetrics(user.id),
    getWeeklyApplications(user.id),
  ]);

  return (
    <>
      <PageHeader
        title={`Welcome${user.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="An overview of your job search at a glance."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Applications"
          value={String(metrics.totalApplications)}
          hint={`+${metrics.applicationsThisWeek} this week`}
        />
        <MetricCard
          label="Interviews"
          value={String(metrics.interviewCount)}
          hint={
            metrics.avgDaysToInterview !== null
              ? `avg ${metrics.avgDaysToInterview.toFixed(1)} days to first interview`
              : "no interviews scheduled yet"
          }
        />
        <MetricCard
          label="Offers"
          value={String(metrics.offerCount)}
          hint={`offer rate ${percent(metrics.offerRate)}`}
        />
        <MetricCard
          label="Response rate"
          value={percent(metrics.responseRate)}
          hint={`of ${metrics.appliedCount} applied`}
        />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <WeeklyChart weeks={weeks} />
        <PipelineBreakdown byStatus={metrics.byStatus} />
      </div>
    </>
  );
}
