"use client";

import { useState } from "react";
import { format, isPast } from "date-fns";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { addTask, toggleTask } from "@/features/applications/actions/add-task";
import type { ApplicationDetail } from "@/features/applications/queries/get-application-detail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TasksCard({
  applicationId,
  tasks,
}: {
  applicationId: string;
  tasks: ApplicationDetail["tasks"];
}) {
  const [title, setTitle] = useState("");
  const [pending, setPending] = useState(false);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setPending(true);
    const result = await addTask({ applicationId, title });
    setPending(false);
    if (result.success) {
      setTitle("");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={onAdd} className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Follow up with recruiter…"
          />
          <Button type="submit" size="icon" disabled={pending || !title.trim()}>
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            <span className="sr-only">Add task</span>
          </Button>
        </form>
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={async (checked) => {
                    const result = await toggleTask({
                      id: task.id,
                      completed: checked === true,
                    });
                    if (!result.success) toast.error(result.error);
                  }}
                />
                <span
                  className={cn(
                    "text-sm",
                    task.completed && "text-muted-foreground line-through"
                  )}
                >
                  {task.title}
                </span>
                {task.dueDate && (
                  <span
                    className={cn(
                      "ml-auto text-xs",
                      !task.completed && isPast(task.dueDate)
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(task.dueDate, "MMM d")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
