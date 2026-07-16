"use client";

import { Copy, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteSnippet,
  toggleFavorite,
} from "@/features/snippets/actions/mutate-snippet";
import { CATEGORY_LABELS } from "@/features/snippets/categories";
import { SnippetDialog } from "@/features/snippets/components/snippet-dialog";
import type { SnippetRow } from "@/features/snippets/queries/get-snippets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SnippetCard({ snippet }: { snippet: SnippetRow }) {
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(snippet.content);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't access the clipboard");
    }
  }

  async function onToggleFavorite() {
    const result = await toggleFavorite({
      id: snippet.id,
      isFavorite: !snippet.isFavorite,
    });
    if (!result.success) toast.error(result.error);
  }

  async function onDelete() {
    const result = await deleteSnippet({ id: snippet.id });
    if (result.success) toast.success("Snippet deleted");
    else toast.error(result.error);
  }

  return (
    <Card className="flex flex-col gap-3 py-4">
      <CardHeader className="px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-medium">{snippet.title}</div>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <Badge variant="secondary">
                {CATEGORY_LABELS[snippet.category]}
              </Badge>
              {snippet.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={onToggleFavorite}
          >
            <Star
              className={cn(
                "size-4",
                snippet.isFavorite
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
            />
            <span className="sr-only">
              {snippet.isFavorite ? "Unfavorite" : "Favorite"}
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-4">
        <pre className="text-muted-foreground line-clamp-4 flex-1 whitespace-pre-wrap font-mono text-xs">
          {snippet.content}
        </pre>
        <div className="mt-3 flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={onCopy}>
            <Copy className="size-3.5" />
            Copy
          </Button>
          <div className="ml-auto flex items-center">
            <SnippetDialog snippet={snippet} />
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive size-7"
              onClick={onDelete}
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Delete snippet</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
