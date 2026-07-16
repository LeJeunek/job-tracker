"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createSnippet } from "@/features/snippets/actions/create-snippet";
import { updateSnippet } from "@/features/snippets/actions/mutate-snippet";
import { CATEGORY_LABELS } from "@/features/snippets/categories";
import type { SnippetRow } from "@/features/snippets/queries/get-snippets";
import { SnippetCategory } from "@/lib/generated/prisma/enums";
import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  category: z.enum(SnippetCategory),
  content: z.string().trim().min(1, "Content is required").max(50000),
  tagsInput: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function SnippetDialog({ snippet }: { snippet?: SnippetRow }) {
  const [open, setOpen] = useState(false);
  const editing = Boolean(snippet);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: snippet?.title ?? "",
      category: snippet?.category ?? "OTHER",
      content: snippet?.content ?? "",
      tagsInput: snippet?.tags.join(", ") ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const payload = {
      title: values.title,
      category: values.category,
      content: values.content,
      tags: values.tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isFavorite: snippet?.isFavorite ?? false,
    };
    const result = snippet
      ? await updateSnippet({ ...payload, id: snippet.id })
      : await createSnippet(payload);
    if (result.success) {
      toast.success(editing ? "Snippet updated" : "Snippet created");
      if (!editing) reset();
      setOpen(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {editing ? (
        <DialogTrigger
          render={<Button variant="ghost" size="icon" className="size-7" />}
        >
          <Pencil className="size-3.5" />
          <span className="sr-only">Edit snippet</span>
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button />}>
          <Plus className="size-4" />
          New snippet
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit snippet" : "New snippet"}</DialogTitle>
          <DialogDescription>
            Markdown supported — write it once, copy it anywhere.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="snippet-title">Title *</Label>
              <Input
                id="snippet-title"
                placeholder="Elevator pitch"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-destructive text-xs">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    items={CATEGORY_LABELS}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="snippet-content">Content (markdown) *</Label>
            <Textarea
              id="snippet-content"
              rows={10}
              className="font-mono text-sm"
              placeholder={"Hi {name},\n\nThanks for reaching out…"}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-destructive text-xs">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="snippet-tags">Tags (comma-separated)</Label>
            <Input
              id="snippet-tags"
              placeholder="remote, referral, senior"
              {...register("tagsInput")}
            />
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
              {editing ? "Save changes" : "Create snippet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
