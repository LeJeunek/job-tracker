"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarClock, Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { scheduleInterview } from "@/features/applications/actions/schedule-interview";
import {
  interviewSchema,
  type InterviewInput,
} from "@/features/applications/schemas/interview-schema";
import type { ApplicationDetail } from "@/features/applications/queries/get-application-detail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function InterviewsCard({
  applicationId,
  interviews,
}: {
  applicationId: string;
  interviews: ApplicationDetail["interviews"];
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof interviewSchema>, unknown, InterviewInput>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      applicationId,
      round: "",
      interviewer: "",
      location: "",
      notes: "",
    },
  });

  async function onSubmit(values: InterviewInput) {
    const result = await scheduleInterview(values);
    if (result.success) {
      toast.success("Interview added");
      reset();
      setOpen(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Interviews</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            <Plus className="size-3.5" />
            Schedule
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule interview</DialogTitle>
              <DialogDescription>
                Logged on the application timeline.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interview-round">Round *</Label>
                <Input
                  id="interview-round"
                  placeholder="Phone screen"
                  {...register("round")}
                />
                {errors.round && (
                  <p className="text-destructive text-xs">
                    {errors.round.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="interview-when">When</Label>
                <Input
                  id="interview-when"
                  type="datetime-local"
                  {...register("scheduledFor")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interview-interviewer">Interviewer</Label>
                  <Input
                    id="interview-interviewer"
                    {...register("interviewer")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interview-location">Location</Label>
                  <Input
                    id="interview-location"
                    placeholder="Zoom"
                    {...register("location")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interview-notes">Notes</Label>
                <Textarea id="interview-notes" rows={2} {...register("notes")} />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Add interview
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {interviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nothing scheduled yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {interviews.map((interview) => (
              <li key={interview.id} className="flex items-start gap-3">
                <CalendarClock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div className="min-w-0 text-sm">
                  <p className="font-medium">{interview.round}</p>
                  <p className="text-muted-foreground text-xs">
                    {interview.scheduledFor
                      ? format(interview.scheduledFor, "PPp")
                      : "unscheduled"}
                    {interview.interviewer && ` · ${interview.interviewer}`}
                    {interview.location && ` · ${interview.location}`}
                  </p>
                  {interview.result && (
                    <p className="text-xs">{interview.result}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
