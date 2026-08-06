"use client";

import { useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";

import { BOARD_COLUMNS, statusLabel } from "@/features/kanban/columns";
import { DemoStatusColumn } from "@/app/demo/_components/demo-status-column";
import type { BoardApplication } from "@/features/kanban/types";
import type { ApplicationStatus } from "@/lib/generated/prisma/enums";

type ColumnMap = Record<ApplicationStatus, BoardApplication[]>;

function groupByStatus(applications: BoardApplication[]): ColumnMap {
  const map = {} as ColumnMap;
  for (const column of BOARD_COLUMNS) {
    map[column.status] = [];
  }
  for (const app of applications) {
    map[app.status].push(app);
  }
  return map;
}

export function DemoKanbanBoard({
  applications,
}: {
  applications: BoardApplication[];
}) {
  const [columns, setColumns] = useState<ColumnMap>(() =>
    groupByStatus(applications)
  );

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const from = source.droppableId as ApplicationStatus;
    const to = destination.droppableId as ApplicationStatus;

    setColumns((prev) => {
      const fromList = [...prev[from]];
      const [moved] = fromList.splice(source.index, 1);
      if (!moved) return prev;
      const toList = from === to ? fromList : [...prev[to]];
      toList.splice(destination.index, 0, { ...moved, status: to });
      return { ...prev, [from]: fromList, [to]: toList };
    });

    if (from !== to) {
      toast.success(`Moved to ${statusLabel(to)}`, {
        description: "Demo mode — changes aren't saved.",
      });
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board-scroll -mx-4 flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:snap-none md:px-0 lg:gap-4">
        {BOARD_COLUMNS.map((column) => (
          <DemoStatusColumn
            key={column.status}
            column={column}
            applications={columns[column.status]}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
