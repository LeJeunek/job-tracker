"use client";

import { Droppable } from "@hello-pangea/dnd";

import { ApplicationCard } from "@/features/kanban/components/application-card";
import type { BoardColumn } from "@/features/kanban/columns";
import type { BoardApplication } from "@/features/kanban/types";
import { cn } from "@/lib/utils";

export function StatusColumn({
  column,
  applications,
}: {
  column: BoardColumn;
  applications: BoardApplication[];
}) {
  return (
    <div className="bg-muted/40 flex w-72 shrink-0 flex-col rounded-lg border">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className={cn("size-2 rounded-full", column.dot)} />
        <span className="text-sm font-medium">{column.label}</span>
        <span className="text-muted-foreground ml-auto text-xs tabular-nums">
          {applications.length}
        </span>
      </div>
      <Droppable droppableId={column.status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex min-h-24 flex-1 flex-col gap-2 p-2 pt-0 transition-colors",
              snapshot.isDraggingOver && "bg-accent/50"
            )}
          >
            {applications.map((application, index) => (
              <ApplicationCard
                key={application.id}
                application={application}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
