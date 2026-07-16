import { formatDistanceToNow } from "date-fns";
import {
  ArrowRightLeft,
  CalendarClock,
  FileText,
  ListTodo,
  MessageSquare,
  Pencil,
  Sparkles,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import type { ApplicationDetail } from "@/features/applications/queries/get-application-detail";
import type { ActivityType } from "@/lib/generated/prisma/enums";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ICONS: Record<ActivityType, LucideIcon> = {
  CREATED: Sparkles,
  UPDATED: Pencil,
  STATUS_CHANGED: ArrowRightLeft,
  NOTE: MessageSquare,
  CONTACT: UserPlus,
  INTERVIEW: CalendarClock,
  TASK: ListTodo,
  DOCUMENT: FileText,
};

export function ActivityTimeline({
  activities,
}: {
  activities: ApplicationDetail["activities"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">No activity yet.</p>
        ) : (
          <ol className="space-y-4">
            {activities.map((activity) => {
              const Icon = ICONS[activity.type];
              return (
                <li key={activity.id} className="flex gap-3">
                  <span className="bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(activity.createdAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
