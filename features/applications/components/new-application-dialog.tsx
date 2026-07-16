"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod";

import { createApplication } from "@/features/applications/actions/create-application";
import {
  applicationSchema,
  type ApplicationInput,
} from "@/features/applications/schemas/application-schema";
import { BOARD_COLUMNS } from "@/features/kanban/columns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export function NewApplicationDialog() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof applicationSchema>,
    unknown,
    ApplicationInput
  >({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      title: "",
      companyName: "",
      status: "WISHLIST",
      priority: "MEDIUM",
      location: "",
      remote: false,
      applicationUrl: "",
      source: "",
      notes: "",
    },
  });

  async function onSubmit(values: ApplicationInput) {
    const result = await createApplication(values);
    if (result.success) {
      toast.success("Application added");
      reset();
      setOpen(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        Add application
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add application</DialogTitle>
          <DialogDescription>
            Track a new job application on your board.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job title *</Label>
            <Input
              id="title"
              placeholder="Frontend Engineer"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company *</Label>
            <Input
              id="companyName"
              placeholder="Acme Corp"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="text-destructive text-xs">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BOARD_COLUMNS.map((column) => (
                        <SelectItem key={column.status} value={column.status}>
                          {column.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0) +
                            priority.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Austin, TX"
                {...register("location")}
              />
            </div>
            <div className="flex items-end pb-2">
              <Controller
                control={control}
                name="remote"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                    Remote
                  </label>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Salary min ($)</Label>
              <Input
                id="salaryMin"
                type="number"
                min={0}
                placeholder="90000"
                {...register("salaryMin")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Salary max ($)</Label>
              <Input
                id="salaryMax"
                type="number"
                min={0}
                placeholder="120000"
                {...register("salaryMax")}
              />
            </div>
          </div>
          {(errors.salaryMin || errors.salaryMax) && (
            <p className="text-destructive text-xs">
              {errors.salaryMin?.message ?? errors.salaryMax?.message}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="applicationUrl">Job posting URL</Label>
            <Input
              id="applicationUrl"
              placeholder="https://…"
              {...register("applicationUrl")}
            />
            {errors.applicationUrl && (
              <p className="text-destructive text-xs">
                {errors.applicationUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              placeholder="LinkedIn, referral, …"
              {...register("source")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} {...register("notes")} />
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
              Add application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
