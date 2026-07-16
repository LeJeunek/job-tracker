import { BOARD_COLUMNS } from "@/features/kanban/columns";
import type { DashboardMetrics } from "@/features/dashboard/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PipelineBreakdown({
  byStatus,
}: {
  byStatus: DashboardMetrics["byStatus"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
          {BOARD_COLUMNS.map((column) => (
            <div
              key={column.status}
              className="flex items-center gap-2 text-sm"
            >
              <span className={cn("size-2 shrink-0 rounded-full", column.dot)} />
              <span className="text-muted-foreground truncate">
                {column.label}
              </span>
              <span className="ml-auto font-medium tabular-nums">
                {byStatus[column.status]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
