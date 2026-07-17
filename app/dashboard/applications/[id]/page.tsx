import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Building2, ExternalLink, MapPin } from "lucide-react";

import { ActivityTimeline } from "@/features/applications/components/activity-timeline";
import { ApplicationDialog } from "@/features/applications/components/application-dialog";
import { InterviewsCard } from "@/features/applications/components/interviews-card";
import { TasksCard } from "@/features/applications/components/tasks-card";
import { getApplicationDetail } from "@/features/applications/queries/get-application-detail";
import { PRIORITY_STYLES, statusLabel } from "@/features/kanban/columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata = { title: "Application" };

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const application = await getApplicationDetail(user.id, id);
  if (!application) notFound();

  const salary =
    application.salaryMin || application.salaryMax
      ? [application.salaryMin, application.salaryMax]
          .filter((n): n is number => n !== null)
          .map((n) => `$${Math.round(n / 1000)}k`)
          .join(" – ")
      : null;

  return (
    <div className="mx-auto max-w-5xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2"
        nativeButton={false}
        render={<Link href="/dashboard/applications" />}
      >
        <ArrowLeft className="size-4" />
        Back to board
      </Button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {application.title}
          </h1>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="flex items-center gap-1">
              <Building2 className="size-3.5" />
              {application.company.name}
            </span>
            {application.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {application.location}
              </span>
            )}
            {application.applicationUrl && (
              <a
                href={application.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground flex items-center gap-1 underline underline-offset-2"
              >
                <ExternalLink className="size-3.5" />
                Job posting
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <ApplicationDialog
            application={{
              id: application.id,
              title: application.title,
              status: application.status,
              priority: application.priority,
              location: application.location,
              remote: application.remote,
              salaryMin: application.salaryMin,
              salaryMax: application.salaryMax,
              applicationUrl: application.applicationUrl,
              source: application.source,
              notes: application.notes,
              companyName: application.company.name,
            }}
          />
          <Badge variant="secondary">{statusLabel(application.status)}</Badge>
          <Badge
            className={cn(
              "border-transparent",
              PRIORITY_STYLES[application.priority]
            )}
          >
            {application.priority.toLowerCase()}
          </Badge>
          {application.remote && <Badge variant="outline">Remote</Badge>}
          {salary && <Badge variant="outline">{salary}</Badge>}
        </div>
      </div>

      <div className="text-muted-foreground mb-6 flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <span>Added {format(application.createdAt, "PP")}</span>
        {application.appliedAt && (
          <span>Applied {format(application.appliedAt, "PP")}</span>
        )}
        {application.source && <span>Source: {application.source}</span>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {application.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">
                  {application.notes}
                </p>
              </CardContent>
            </Card>
          )}
          <InterviewsCard
            applicationId={application.id}
            interviews={application.interviews}
          />
          <TasksCard applicationId={application.id} tasks={application.tasks} />
          {application.contacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {application.contacts.map((contact) => (
                    <li key={contact.id} className="text-sm">
                      <span className="font-medium">{contact.name}</span>
                      {contact.title && (
                        <span className="text-muted-foreground">
                          {" "}
                          · {contact.title}
                        </span>
                      )}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-muted-foreground hover:text-foreground block text-xs underline underline-offset-2"
                        >
                          {contact.email}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        <ActivityTimeline activities={application.activities} />
      </div>
    </div>
  );
}
