import { format } from "date-fns";

import type { WeeklyCount } from "@/features/dashboard/queries/get-weekly-applications";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Validated against light (#fcfcfb) and dark (#1a1a19) surfaces —
// passes lightness band, chroma floor, and 3:1 contrast in both modes.
const BAR_COLOR = "#3b82f6";

export function WeeklyChart({ weeks }: { weeks: WeeklyCount[] }) {
  const max = Math.max(...weeks.map((w) => w.count), 1);
  const latest = weeks[weeks.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Applications per week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-36 items-end gap-2" aria-hidden="true">
          {weeks.map((week) => {
            const isLatest = week === latest;
            return (
              <div
                key={week.weekStart.toISOString()}
                className="group relative flex h-full flex-1 flex-col justify-end"
              >
                <div className="bg-popover text-popover-foreground pointer-events-none absolute -top-2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border px-2 py-1 text-xs shadow-sm group-hover:block">
                  {week.count} application{week.count === 1 ? "" : "s"} · week
                  of {format(week.weekStart, "MMM d")}
                </div>
                {isLatest && week.count > 0 && (
                  <div className="text-foreground mb-0.5 text-center text-xs font-medium tabular-nums">
                    {week.count}
                  </div>
                )}
                {week.count > 0 ? (
                  <div
                    className="mx-auto w-full max-w-9 rounded-t-[4px]"
                    style={{
                      backgroundColor: BAR_COLOR,
                      height: `${Math.max((week.count / max) * 100, 6)}%`,
                    }}
                  />
                ) : (
                  <div className="bg-muted mx-auto h-0.5 w-full max-w-9" />
                )}
                <div className="text-muted-foreground mt-1.5 truncate text-center text-[10px]">
                  {format(week.weekStart, "M/d")}
                </div>
              </div>
            );
          })}
        </div>
        <table className="sr-only">
          <caption>Applications created per week</caption>
          <thead>
            <tr>
              <th>Week starting</th>
              <th>Applications</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week.weekStart.toISOString()}>
                <td>{format(week.weekStart, "PP")}</td>
                <td>{week.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
