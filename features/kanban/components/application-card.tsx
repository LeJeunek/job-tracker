"use client";

import Link from "next/link";
import { Draggable } from "@hello-pangea/dnd";
import { formatDistanceToNow } from "date-fns";
import { Building2, MapPin, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteApplication } from "@/features/applications/actions/delete-application";
import { PRIORITY_STYLES } from "@/features/kanban/columns";
import type { BoardApplication } from "@/features/kanban/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function formatSalary(app: BoardApplication) {
  const fmt = (n: number) =>
    n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);
  if (app.salaryMin && app.salaryMax)
    return `$${fmt(app.salaryMin)}–$${fmt(app.salaryMax)}`;
  if (app.salaryMin) return `$${fmt(app.salaryMin)}+`;
  if (app.salaryMax) return `up to $${fmt(app.salaryMax)}`;
  return null;
}

export function ApplicationCard({
  application,
  index,
}: {
  application: BoardApplication;
  index: number;
}) {
  const salary = formatSalary(application);

  return (
    <Draggable draggableId={application.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-card space-y-2.5 rounded-lg border p-3.5 text-sm shadow-sm transition-shadow",
            snapshot.isDragging && "shadow-lg ring-2 ring-ring"
          )}
        >
          <div className="flex items-start justify-between gap-1">
            <Link
              href={`/dashboard/applications/${application.id}`}
              className="text-[0.9375rem] font-medium leading-snug hover:underline"
            >
              {application.title}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mr-1 -mt-1 size-6 shrink-0"
                  />
                }
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Application actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    const result = await deleteApplication({
                      id: application.id,
                    });
                    if (result.success) {
                      toast.success("Application deleted");
                    } else {
                      toast.error(result.error);
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Building2 className="size-3.5 shrink-0" />
            <span className="truncate">{application.company.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
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
          <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
            {application.location ? (
              <span className="flex min-w-0 items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{application.location}</span>
              </span>
            ) : (
              <span />
            )}
            <span className="shrink-0">
              {formatDistanceToNow(application.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
