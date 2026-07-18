"use client";

import { useState, useTransition } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";

import { moveApplication } from "@/features/kanban/actions/move-application";
import { BOARD_COLUMNS, statusLabel } from "@/features/kanban/columns";
import { StatusColumn } from "@/features/kanban/components/status-column";
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

export function KanbanBoard({
  applications,
}: {
  applications: BoardApplication[];
}) {
  const [columns, setColumns] = useState<ColumnMap>(() =>
    groupByStatus(applications)
  );
  const [prevApplications, setPrevApplications] = useState(applications);
  const [, startTransition] = useTransition();

  // Adopt fresh server data after revalidation (state-during-render
  // pattern; see react.dev "You Might Not Need an Effect").
  if (prevApplications !== applications) {
    setPrevApplications(applications);
    setColumns(groupByStatus(applications));
  }

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const from = source.droppableId as ApplicationStatus;
    const to = destination.droppableId as ApplicationStatus;

    const previous = columns;
    const next: ColumnMap = { ...columns };
    const fromList = [...next[from]];
    const [moved] = fromList.splice(source.index, 1);
    if (!moved) return;
    next[from] = fromList;

    const toList = from === to ? fromList : [...next[to]];
    toList.splice(destination.index, 0, { ...moved, status: to });
    next[to] = toList;

    setColumns(next);

    startTransition(async () => {
      const result = await moveApplication({
        id: draggableId,
        status: to,
        index: destination.index,
      });
      if (!result.success) {
        setColumns(previous);
        toast.error(result.error);
        return;
      }
      if (from !== to) {
        toast.success(`Moved to ${statusLabel(to)}`, {
          action: {
            label: "Undo",
            onClick: () => {
              setColumns(previous);
              startTransition(async () => {
                const undo = await moveApplication({
                  id: draggableId,
                  status: from,
                  index: source.index,
                });
                if (!undo.success) toast.error(undo.error);
              });
            },
          },
        });
      }
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board-scroll -mx-4 flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:snap-none md:px-0 lg:gap-4">
        {BOARD_COLUMNS.map((column) => (
          <StatusColumn
            key={column.status}
            column={column}
            applications={columns[column.status]}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
